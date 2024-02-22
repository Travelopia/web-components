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
		 * If the event is has a pointerType, which means it's a mouse event or touch event
		 * Only then we remove pill.
		 * This will ensure, it will not get fired when a enter button is pressed.
		 * We do this so that it does not remove the pills when enter button is pressed.
		 */
		if ( e?.pointerType ) {
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
