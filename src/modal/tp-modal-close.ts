/**
 * Internal dependencies.
 */
import { TPModalElement } from './tp-modal';

/**
 * TP Modal Close.
 */
export class TPModalCloseElement extends HTMLElement {
	/**
	 * Connected callback.
	 */
	connectedCallback(): void {
		const button: HTMLButtonElement | null = this.querySelector( 'button' );
		button?.addEventListener( 'click', this.closeModal.bind( this ) );
	}

	/**
	 * Close the modal.
	 */
	closeModal(): void {
		const modal: TPModalElement | null = this.closest( 'tp-modal' );
		modal?.close();
	}
}
