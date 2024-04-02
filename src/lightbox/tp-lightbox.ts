/**
 * Internal dependencies.
 */
import { TPLightboxContentElement } from './tp-lightbox-content';
import { TPLightboxPreviousElement } from './tp-lightbox-previous';
import { TPLightboxNextElement } from './tp-lightbox-next';
import { TPLightboxTriggerElement } from './tp-lightbox-trigger';
import { TPLightboxCountElement } from './tp-lightbox-count';

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

	/**
	 * Constructor.
	 */
	constructor() {
		super();

		// Event listeners.
		this.querySelector( 'dialog' )?.addEventListener( 'click', this.handleDialogClick.bind( this ) );
	}

	/**
	 * Get observed attributes.
	 *
	 * @return {Array} List of observed attributes.
	 */
	static get observedAttributes(): string[] {
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
			return;
		}

		this.dispatchEvent( new CustomEvent( 'change' ) );

		// Trigger current index target if index has changed.
		if ( 'index' === name ) {
			this.triggerCurrentIndexTarget();
		}
	}

	/**
	 * Get template.
	 */
	get template(): HTMLTemplateElement | null {
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

		// Get lightbox content element.
		const content: TPLightboxContentElement | null = this.querySelector( 'tp-lightbox-content' );
		if ( ! content ) {
			return;
		}

		// Check if we have a template.
		if ( this.currentTemplate ) {
			// We do, update content with template's content.
			// We do this rather than a string to avoid script injection.
			const templateContent: Node = this.currentTemplate.content.cloneNode( true );
			content.replaceChildren( templateContent );

			setTimeout( (): void => {
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
		return this.currentGroup;
	}

	/**
	 * Set current group.
	 *
	 * @param {string} group Group name.
	 */
	set group( group: string ) {
		this.currentGroup = group;
	}

	/**
	 * Get current index.
	 */
	get currentIndex(): number {
		return parseInt( this.getAttribute( 'index' ) ?? '1' );
	}

	/**
	 * Set current index.
	 *
	 * @param {number} index Current index.
	 */
	set currentIndex( index: number ) {
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
		if ( ! allGroups || ! allGroups[ this.currentIndex - 1 ] ) {
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
			return;
		}

		// Check if we have elements within group.
		const allGroups: NodeListOf<TPLightboxTriggerElement> | null = this.getAllGroups();
		if ( ! allGroups ) {
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
			return;
		}

		// Check if we have elements within group.
		const allGroups: NodeListOf<TPLightboxTriggerElement> | null = this.getAllGroups();
		if ( ! allGroups ) {
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
		if ( allGroups && allGroups.length ) {
			this.allGroups = allGroups;
			this.setAttribute( 'total', this.allGroups.length.toString() );
			return;
		}

		this.allGroups = document.querySelectorAll( `tp-lightbox-trigger[group="${ this.group }"]` );
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
			return;
		}

		// Check if we have a group.
		if ( '' === this.group ) {
			previous?.setAttribute( 'disabled', 'yes' );
			next?.setAttribute( 'disabled', 'yes' );
			return;
		}

		// Check if we have elements within the group.
		const allGroups: NodeListOf<TPLightboxTriggerElement> | null = this.getAllGroups();
		if ( ! allGroups ) {
			previous?.setAttribute( 'disabled', 'yes' );
			next?.setAttribute( 'disabled', 'yes' );
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
		if ( ! content ) {
			return;
		}

		// Bail if there are no images within current content.
		const images: NodeListOf<HTMLImageElement> = content.querySelectorAll( 'img' );
		if ( ! images.length ) {
			this.removeAttribute( 'loading' );
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
			counter++;

			// Remove loading attribute once all images have loaded.
			if ( counter === totalImages ) {
				this.removeAttribute( 'loading' );
			}
		};

		// Check if images have loaded, else add an event listener.
		images.forEach( ( image: HTMLImageElement ): void => {
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
		if (
			'yes' === this.getAttribute( 'close-on-overlay-click' ) &&
			this.querySelector( 'dialog' ) === e.target
		) {
			this.close();
		}
	}
}
