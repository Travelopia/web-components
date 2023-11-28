/**
 * Internal dependencies.
 */
import { TPMultiSelectElement } from './tp-multi-select';

/**
 * TP Multi Select Pill.
 */
export class TPMultiSelectPillElement extends HTMLElement {
	/**
	 * Connected callback.
	 */
	connectedCallback(): void {
		this.querySelector( 'button' )?.addEventListener( 'click', this.handleButtonClick.bind( this ) );
	}

	/**
	 * Handle button click.
	 *
	 * @param {Event} e Click event.
	 */
	handleButtonClick( e: Event | null ): void {
		e?.preventDefault();
		e?.stopPropagation();
		this.removePill();
	}

	/**
	 * Remove this pill.
	 */
	removePill(): void {
		const multiSelect: TPMultiSelectElement | null = this.closest( 'tp-multi-select' );
		if ( multiSelect && this.getAttribute( 'value' ) ) {
			multiSelect.unSelect( this.getAttribute( 'value' ) ?? '' );
		}
	}
}
