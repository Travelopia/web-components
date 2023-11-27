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
		this.querySelector( 'button' )?.addEventListener( 'click', this.removePill.bind( this ) );
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