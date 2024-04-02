/**
 * Internal dependencies.
 */
import { TPLightboxContentElement } from './tp-lightbox-content';
import { TPLightboxPreviousElement } from './tp-lightbox-previous';
import { TPLightboxNextElement } from './tp-lightbox-next';
import { TPLightboxTriggerElement } from './tp-lightbox-trigger';

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
	 * Get observed attributes.
	 *
	 * @return {Array} List of observed attributes.
	 */
	static get observedAttributes(): string[] {
		return [ 'index' ];
	}

	/**
	 * Attribute changed callback.
	 *
	 * @param {string} _name    Attribute name.
	 * @param {string} oldValue Old value.
	 * @param {string} newValue New value.
	 */
	attributeChangedCallback( _name: string = '', oldValue: string = '', newValue: string = '' ): void {
		// Prevent redundant updates.
		if ( oldValue === newValue ) {
			return;
		}

		// Get all groups and check if current index exists within group.
		const allGroups: NodeListOf<TPLightboxTriggerElement> | null = this.getAllGroups();
		if ( ! allGroups || ! allGroups[ this.currentIndex - 1 ] ) {
			return;
		}

		// Trigger element within group.
		allGroups[ this.currentIndex - 1 ].trigger();
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
	 * Open lightbox.
	 */
	open(): void {
		// Get the dialog element.
		const dialog: HTMLDialogElement | null = this.querySelector( 'dialog' );

		// Check if dialog exists or is already open.
		if ( ! dialog || dialog.open ) {
			return;
		}

		// First, take this opportunity to update all groups.
		this.updateAllGroups();

		// Now, show the modal.
		dialog.showModal();
	}

	/**
	 * Close lightbox.
	 */
	close(): void {
		// Find and close the dialog.
		const dialog: HTMLDialogElement | null = this.querySelector( 'dialog' );
		dialog?.close();

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
	 */
	updateAllGroups(): void {
		this.allGroups = document.querySelectorAll( `tp-lightbox-trigger[group="${ this.group }"]` );
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
}
