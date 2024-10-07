/**
 * TP Number Spinner Increment Element.
 */
export class TPNumberSpinnerIncrement extends HTMLElement {
	private min: number = 0;
	private max: number = 100;
	private step: number = 1;
	private value: number = 0;
	private inputElement: HTMLInputElement | null = null;

	/**
	 * Constructor.
	 */
	constructor() {
		// Initialize parent.
		super();

		// Get the input element from the closest tp-number-spinner.
		this.inputElement = this.closest( 'tp-number-spinner' )?.querySelector( 'tp-number-spinner-input input' ) as HTMLInputElement | null;

		// If the input element is found, initialize min, max, step, and value from the input attributes.
		if ( this.inputElement ) {
			this.min = parseInt( this.inputElement.getAttribute( 'min' ) || '0', 10 );
			this.max = parseInt( this.inputElement.getAttribute( 'max' ) || '100', 10 );
			this.step = parseInt( this.inputElement.getAttribute( 'step' ) || '1', 10 );
			this.value = parseInt( this.inputElement.value || this.min.toString(), 10 );

			// Initialize the input element with the value.
			this.inputElement.value = this.value.toString();
		}

		// Attach click event for increment.
		this.querySelector( 'button' )?.addEventListener( 'click', this.increment.bind( this ) );
	}

	/**
	 * Increment the value.
	 */
	increment(): void {
		if ( ! this.inputElement ) {
			return;
		}

		// Parse the current value from the input.
		const currentValue: number = parseInt( this.inputElement.value, 10 ) || this.value;

		// Calculate the new value.
		const newValue: number = currentValue + this.step;

		// Check if the new value is within the max limit.
		if ( newValue <= this.max ) {
			// Update the value and input field.
			this.value = newValue;
			this.inputElement.value = this.value.toString();
		}
	}
}
