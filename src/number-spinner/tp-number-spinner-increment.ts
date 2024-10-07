/**
 * Internal dependencies.
 */
import { TPNumberSpinner } from './tp-number-spinner';

/**
 * TP Number Spinner Increment Element.
 */
export class TPNumberSpinnerIncrement extends HTMLElement {
	/**
	 * Constructor.
	 */
	constructor() {
		// Initialize parent.
		super();

		// Attach click event for increment.
		this.querySelector( 'button' )?.addEventListener( 'click', this.increment.bind( this ) );
	}

	/**
	 * Increment the value.
	 */
	increment(): void {
		// Run function on parent.
		const numberSpinner: TPNumberSpinner | null = this.closest( 'tp-number-spinner' );
		numberSpinner?.increment();
	}
}
