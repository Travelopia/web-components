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
	 * @param {any} e Click event.
	 */
	handleButtonClick( e: any | null ): void {
		e?.preventDefault();
		e?.stopPropagation();

		/**
		 * If the event has a clientX greater than 0, then it is a genuine click event.
		 * Only then we remove pill.
		 * This will ensure, it will not get fired when the enter button is pressed.
		 * We do this so that it does not remove the pills when enter button is pressed.
		 */
		if ( e?.clientX ?? 0 > 0 ) {
			this.removePill();
		}
	}

	/**
	 * Remove this pill.
	 */
	removePill(): void {
		const multiSelect: TPMultiSelectElement | null = this.closest( 'tp-multi-select' );
		if ( multiSelect && this.getAttribute( 'value' ) ) {
			multiSelect.unSelect( this.getAttribute( 'value' ) ?? '' );
			multiSelect.dispatchEvent( new CustomEvent( 'unselect', { bubbles: true } ) );
			multiSelect.dispatchEvent( new CustomEvent( 'change', { bubbles: true } ) );
		}
	}
}
