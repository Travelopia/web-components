/**
 * Internal dependencies.
 */
import { TPNumberSpinner } from './tp-number-spinner';

/**
 * TP Number Spinner Decrement Element.
 */
export class TPNumberSpinnerDecrement extends HTMLElement {
	/**
	 * Constructor.
	 */
	constructor() {
		// Initialize parent.
		super();

		// Attach click event for decrement.
		this.querySelector( 'button' )?.addEventListener( 'click', this.decrement.bind( this ) );
	}

	/**
	 * Decrement the value.
	 */
	decrement(): void {
		// Run function on parent.
		const numberSpinner: TPNumberSpinner | null = this.closest( 'tp-number-spinner' );
		numberSpinner?.decrement();
	}
}
