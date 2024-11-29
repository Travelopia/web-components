/**
 * Internal dependencies.
 */
import { TPLightboxContentElement } from './tp-lightbox-content';
import { TPLightboxPreviousElement } from './tp-lightbox-previous';
import { TPLightboxNextElement } from './tp-lightbox-next';
import { TPLightboxTriggerElement } from './tp-lightbox-trigger';
import { TPLightboxCountElement } from './tp-lightbox-count';
import { TPLightboxNavItemElement } from './tp-lightbox-nav-item';

/**
 * TP Lightbox.
 */
export class TPLightboxElement extends HTMLElement {
	/**
	 * Properties.
	 */
	protected currentTemplate: HTMLTemplateElement | null = null;
	protected currentGroup: string = '';
	protected allGroups: NodeListOf<TPLightboxTriggerElement> | null = null;
	protected touchStartX: number = 0;
	protected touchStartY: number = 0;
	protected swipeThreshold: number = 200;
	protected dialogElement: HTMLDialogElement | null;
	protected lightboxNavItems: NodeListOf<TPLightboxNavItemElement> | null;

	/**
	 * Constructor.
	 */
	constructor() {
		// Initialize parent.
		super();

		// Initialize
		this.dialogElement = this.querySelector( 'dialog' );
		this.lightboxNavItems = this.querySelectorAll( 'tp-lightbox-nav-item' );

		// Event listeners.
		this.dialogElement?.addEventListener( 'click', this.handleDialogClick.bind( this ) );
		this.dialogElement?.addEventListener( 'touchstart', this.handleTouchStart.bind( this ) );
		this.dialogElement?.addEventListener( 'touchend', this.handleTouchEnd.bind( this ) );
	}

	/**
	 * Get observed attributes.
	 *
	 * @return {Array} List of observed attributes.
	 */
	static get observedAttributes(): string[] {
		// Attributes to observe.
		return [ 'open', 'index', 'total', 'close-on-overlay-click', 'loading' ];
	}

	/**
	 * Attribute changed callback.
	 *
	 * @param {string} name     Attribute name.
	 * @param {string} oldValue Old value.
	 * @param {string} newValue New value.
	 */
	attributeChangedCallback( name: string = '', oldValue: string = '', newValue: string = '' ): void {
		// Prevent redundant updates.
		if ( oldValue === newValue ) {
			// Early return.
			return;
		}

		// Trigger change event.
		this.dispatchEvent( new CustomEvent( 'change' ) );

		// Trigger current index target if index has changed.
		if ( 'index' === name ) {
			this.triggerCurrentIndexTarget();
		}

		// Trigger navigation update if open or index has changed.
		if ( 'open' === name || 'index' === name ) {
			this.updateNavCurrentItem();
		}
	}

	/**
	 * Get template.
	 */
	get template(): HTMLTemplateElement | null {
		// Return current template.
		return this.currentTemplate;
	}

	/**
	 * Set template.
	 *
	 * @param {HTMLTemplateElement} template The template.
	 */
	set template( template: HTMLTemplateElement | null ) {
		// Set the template.
		this.currentTemplate = template;
		this.dispatchEvent( new CustomEvent( 'template-set' ) );

		// Get lightbox content element.
		const content: TPLightboxContentElement | null = this.querySelector( 'tp-lightbox-content' );

		// Check if we have a content.
		if ( ! content ) {
			// No we don't. Exit.
			return;
		}

		// Check if we have a template.
		if ( this.currentTemplate ) {
			/**
			 * We do, update content with template's content.
			 * We do this rather than a string to avoid script injection.
			 */
			const templateContent: Node = this.currentTemplate.content.cloneNode( true );
			content.replaceChildren( templateContent );
			this.dispatchEvent( new CustomEvent( 'content-change' ) );

			// Prepare image loading.
			setTimeout( (): void => {
				// We do, prepare image loading.
				this.prepareImageLoading();
				this.prepareNavigation();
			}, 0 );
		} else {
			// We don't, set content as empty.
			content.innerHTML = '';
		}
	}

	/**
	 * Get current group.
	 */
	get group(): string {
		// Return current group.
		return this.currentGroup;
	}

	/**
	 * Set current group.
	 *
	 * @param {string} group Group name.
	 */
	set group( group: string ) {
		// Set current group.
		this.currentGroup = group;
	}

	/**
	 * Get current index.
	 */
	get currentIndex(): number {
		// Return current index.
		return parseInt( this.getAttribute( 'index' ) ?? '1' );
	}

	/**
	 * Set current index.
	 *
	 * @param {number} index Current index.
	 */
	set currentIndex( index: number ) {
		// Set current index.
		if ( index < 1 ) {
			index = 1;
		}

		// Setting this attributes triggers a re-trigger.
		this.setAttribute( 'index', index.toString() );
	}

	/**
	 * Trigger the target that matches the current index within current group.
	 */
	triggerCurrentIndexTarget(): void {
		// Get all groups and check if current index exists within group.
		const allGroups: NodeListOf<TPLightboxTriggerElement> | null = this.getAllGroups();

		// Bail early if we don't have groups.
		if ( ! allGroups || ! allGroups[ this.currentIndex - 1 ] ) {
			// No we don't. Exit.
			return;
		}

		// Trigger element within group.
		allGroups[ this.currentIndex - 1 ].trigger();
	}

	/**
	 * Open lightbox.
	 */
	open(): void {
		// Get the dialog element.
		const dialog: HTMLDialogElement | null = this.querySelector( 'dialog' );

		// Check if dialog exists or is already open.
		if ( ! dialog || dialog.open ) {
			// Yes it is, Exit.
			return;
		}

		// First, take this opportunity to update all groups (if it wasn't set from the trigger).
		if ( '' !== this.group && ! this.allGroups ) {
			this.updateAllGroups();
		}

		// Now, show the modal.
		dialog.showModal();
		this.setAttribute( 'open', 'yes' );
	}

	/**
	 * Close lightbox.
	 */
	close(): void {
		// Find and close the dialog.
		const dialog: HTMLDialogElement | null = this.querySelector( 'dialog' );
		dialog?.close();
		this.removeAttribute( 'open' );

		// Clear groups from memory.
		this.allGroups = null;
	}

	/**
	 * Navigate previous.
	 */
	previous(): void {
		// Check if we even have a group.
		if ( '' === this.group ) {
			// No we don't. Exit.
			return;
		}

		// Check if we have elements within group.
		const allGroups: NodeListOf<TPLightboxTriggerElement> | null = this.getAllGroups();

		// Bail early if we don't have groups.
		if ( ! allGroups ) {
			// No we don't. Exit.
			return;
		}

		// Decrement the current index.
		if ( this.currentIndex > 1 ) {
			this.currentIndex--;
		}
	}

	/**
	 * Navigate next.
	 */
	next(): void {
		// Check if we even have a group.
		if ( '' === this.group ) {
			// No we don't. Exit.
			return;
		}

		// Check if we have elements within group.
		const allGroups: NodeListOf<TPLightboxTriggerElement> | null = this.getAllGroups();

		// Bail early if we don't have groups.
		if ( ! allGroups ) {
			// No we don't. Exit.
			return;
		}

		// Increment the current index.
		if ( this.currentIndex < allGroups.length ) {
			this.currentIndex++;
		}
	}

	/**
	 * Update all groups and save it to memory.
	 *
	 * @param {NodeList} allGroups All groups.
	 */
	updateAllGroups( allGroups: NodeListOf<TPLightboxTriggerElement> | null = null ): void {
		// Update all groups.
		if ( allGroups && allGroups.length ) {
			this.allGroups = allGroups;
			this.setAttribute( 'total', this.allGroups.length.toString() );

			// Exit.
			return;
		}

		// Get all groups.
		this.allGroups = document.querySelectorAll( `tp-lightbox-trigger[group="${ this.group }"]` );

		// Update total.
		if ( ! this.allGroups.length ) {
			this.allGroups = null;
		} else {
			this.setAttribute( 'total', this.allGroups.length.toString() );
		}
	}

	/**
	 * Get all groups from memory.
	 */
	getAllGroups(): NodeListOf<TPLightboxTriggerElement> | null {
		// Return all groups.
		return this.allGroups;
	}

	/**
	 * Prepare navigation.
	 */
	prepareNavigation(): void {
		// Update counter.
		const count: TPLightboxCountElement | null = this.querySelector( 'tp-lightbox-count' );
		count?.update();

		// Get previous and next elements.
		const previous: TPLightboxPreviousElement | null = this.querySelector( 'tp-lightbox-previous' );
		const next: TPLightboxNextElement | null = this.querySelector( 'tp-lightbox-next' );

		// Bail early if we don't have either.
		if ( ! previous && ! next ) {
			// Exit.
			return;
		}

		// Check if we have a group.
		if ( '' === this.group ) {
			previous?.setAttribute( 'disabled', 'yes' );
			next?.setAttribute( 'disabled', 'yes' );

			// Exit.
			return;
		}

		// Check if we have elements within the group.
		const allGroups: NodeListOf<TPLightboxTriggerElement> | null = this.getAllGroups();

		// Disable if we don't have any.
		if ( ! allGroups ) {
			previous?.setAttribute( 'disabled', 'yes' );
			next?.setAttribute( 'disabled', 'yes' );

			// Exit.
			return;
		}

		// Enable / disable previous navigation.
		if ( this.currentIndex <= 1 ) {
			previous?.setAttribute( 'disabled', 'yes' );
		} else {
			previous?.removeAttribute( 'disabled' );
		}

		// Enable / disable next navigation.
		if ( this.currentIndex < allGroups.length ) {
			next?.removeAttribute( 'disabled' );
		} else {
			next?.setAttribute( 'disabled', 'yes' );
		}
	}

	/**
	 * Prepare image loading.
	 */
	prepareImageLoading(): void {
		// Get lightbox content element.
		const content: TPLightboxContentElement | null = this.querySelector( 'tp-lightbox-content' );

		// Bail early if we don't have content.
		if ( ! content ) {
			// Exit.
			return;
		}

		// Bail if there are no images within current content.
		const images: NodeListOf<HTMLImageElement> = content.querySelectorAll( 'img' );

		// Exit early if there are no images.
		if ( ! images.length ) {
			this.removeAttribute( 'loading' );

			// Exit.
			return;
		}

		// Start off by setting the state as loading.
		this.setAttribute( 'loading', 'yes' );

		// Prepare increment variables.
		let counter: number = 0;
		const totalImages: number = images.length;

		/**
		 * Increment counter.
		 */
		const incrementLoadingCounter = (): void => {
			// Increment
			counter++;

			// Remove loading attribute once all images have loaded.
			if ( counter === totalImages ) {
				this.removeAttribute( 'loading' );
			}
		};

		// Check if images have loaded, else add an event listener.
		images.forEach( ( image: HTMLImageElement ): void => {
			// Check if image has loaded.
			if ( image.complete ) {
				incrementLoadingCounter();
			} else {
				image.addEventListener( 'load', incrementLoadingCounter, { once: true } );
			}
		} );
	}

	/**
	 * Handle when the dialog is clicked.
	 *
	 * @param {Event} e Click event.
	 */
	handleDialogClick( e: MouseEvent ): void {
		// Close on overlay click.
		if (
			'yes' === this.getAttribute( 'close-on-overlay-click' ) &&
			this.querySelector( 'dialog' ) === e.target
		) {
			this.close();
		}
	}

	/**
	 * Handles the touch start event.
	 *
	 * @param { TouchEvent } evt The touch event.
	 */
	handleTouchStart( evt: TouchEvent ): void {
		// Check if we should allow swiping?
		if ( 'yes' !== this.getAttribute( 'swipe' ) ) {
			// Nope.
			return;
		}

		// Set the start points.
		this.touchStartX = evt.touches[ 0 ].clientX;
		this.touchStartY = evt.touches[ 0 ].clientY;
	}

	/**
	 * Handles the touch end event.
	 *
	 * @param { TouchEvent } evt The touch event.
	 */
	handleTouchEnd( evt: TouchEvent ): void {
		// Check if we should allow swiping?
		if ( 'yes' !== this.getAttribute( 'swipe' ) ) {
			// Nope.
			return;
		}

		// Calculate the distances.
		const touchEndX: number = evt.changedTouches[ 0 ].clientX;
		const touchEndY: number = evt.changedTouches[ 0 ].clientY;
		const swipeDistanceX: number = touchEndX - this.touchStartX;
		const swipeDistanceY: number = touchEndY - this.touchStartY;

		// Is this horizontal swipe?
		const isHorizontalSwipe = Math.abs( swipeDistanceX ) > Math.abs( swipeDistanceY );

		// Check if this was a horizontal swipe?
		if ( ! isHorizontalSwipe ) {
			// Bail.
			return;
		}

		// Swipe settings
		this.swipeThreshold = Number( this.getAttribute( 'swipe-threshold' ) ?? '200' );

		// Check if it's a right or left swipe.
		if ( swipeDistanceX > 0 ) {
			// Right-Swipe: Check if horizontal swipe distance is less than the threshold.
			if ( swipeDistanceX < this.swipeThreshold ) {
				this.previous();
			}
		} else if ( swipeDistanceX < 0 ) {
			// Left-Swipe: Check if horizontal swipe distance is less than the threshold.
			if ( swipeDistanceX > -this.swipeThreshold ) {
				this.next();
			}
		}
	}

	/**
	 * Set the current slide index.
	 *
	 * @param {number} index Slide index.
	 */
	setCurrentSlide( index: number ): void {
		// Check if slide index is valid.
		if ( index > Number( this.getAttribute( 'total' ) ) || index <= 0 ) {
			// Stop! It's not valid.
			return;
		}

		// dispatch slide-set event.
		this.dispatchEvent( new CustomEvent( 'slide-set', {
			detail: {
				slideIndex: index,
			},
		} ) );

		// Set current slide index.
		this.setAttribute( 'index', index.toString() );
	}

	/**
	 * Update current item in navigation.
	 */
	updateNavCurrentItem(): void {
		// Bail if we don't have nav items.
		if ( ! this.lightboxNavItems ) {
			// Exit.
			return;
		}

		// Update current item.
		this.lightboxNavItems.forEach( ( navItem: TPLightboxNavItemElement, index: number ): void => {
			// Update current attribute.
			if ( this.currentIndex - 1 === index ) {
				navItem.setAttribute( 'current', 'yes' );
			} else {
				navItem.removeAttribute( 'current' );
			}
		} );
	}
}
