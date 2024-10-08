/**
 * Internal dependencies.
 */
import { TPMultiSelectElement } from './tp-multi-select';

/**
 * TP Multi Select Pill.
 */
export class TPMultiSelectPillElement extends HTMLElement {
	/**
	 * Constructor.
	 */
	constructor() {
		// Initialize parent.
		super();

		// Add event listener.
		this.querySelector( 'button' )?.addEventListener( 'click', this.handleButtonClick.bind( this ) );
	}

	/**
	 * Handle button click.
	 *
	 * @param {Event} e Click event.
	 */
	handleButtonClick( e: Event | null ): void {
		// Prevent default behavior and stop propagation.
		e?.preventDefault();
		e?.stopPropagation();

		// Remove pill.
		this.removePill();
	}

	/**
	 * Remove this pill.
	 */
	removePill(): void {
		// Get multi-select.
		const multiSelect: TPMultiSelectElement | null = this.closest( 'tp-multi-select' );

		// Unselect value.
		if ( multiSelect && this.getAttribute( 'value' ) ) {
			multiSelect.unSelect( this.getAttribute( 'value' ) ?? '' );
			multiSelect.dispatchEvent( new CustomEvent( 'unselect', { bubbles: true } ) );
			multiSelect.dispatchEvent( new CustomEvent( 'change', { bubbles: true } ) );
		}
	}
}
