/**
 * Internal dependencies.
 */
import { TPModalElement } from './tp-modal';

/**
 * TP Modal Close.
 */
export class TPModalCloseElement extends HTMLElement {
	/**
	 * Constructor.
	 */
	constructor() {
		// Initialize parent.
		super();

		// Add event listener.
		const button: HTMLButtonElement | null = this.querySelector( 'button' );
		button?.addEventListener( 'click', this.closeModal.bind( this ) );
	}

	/**
	 * Close the modal.
	 */
	closeModal(): void {
		// Get modal and apply close method.
		const modal: TPModalElement | null = this.closest( 'tp-modal' );
		modal?.close();
	}
}
