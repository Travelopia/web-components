/**
 * TP Number Spinner Element.
 */
export class TPNumberSpinner extends HTMLElement {
	/**
	 * Get minimum value.
	 *
	 * @return {number|null} The minimum value.
	 */
	get min(): number | null {
		// Get minimum attribute.
		const min: string | null = this.getAttribute( 'min' );

		// Check if we have an attribute.
		if ( min ) {
			// Yep, return its value.
			return parseInt( min );
		}

		// Nope, return null.
		return null;
	}

	/**
	 * Set minimum value.
	 *
	 * @param {number} min Minimum value.
	 */
	set min( min: number ) {
		// Set attribute.
		this.setAttribute( 'min', min.toString() );
	}

	/**
	 * Get maximum value.
	 *
	 * @return {number|null} The maximum value.
	 */
	get max(): number | null {
		// Get maximum attribute.
		const max: string | null = this.getAttribute( 'max' );

		// Check if we have an attribute.
		if ( max ) {
			// Yep, return its value.
			return parseInt( max );
		}

		// Nope, return null.
		return null;
	}

	/**
	 * Set maximum value.
	 *
	 * @param {number} max Maximum value.
	 */
	set max( max: number ) {
		// Set attribute.
		this.setAttribute( 'max', max.toString() );
	}

	/**
	 * Get current step.
	 *
	 * @return {number} Current step.
	 */
	get step(): number {
		// Get step from attribute.
		return parseInt( this.getAttribute( 'step' ) ?? '1' );
	}

	/**
	 * Set current step.
	 *
	 * @param {number} step Current step.
	 */
	set step( step: number ) {
		// Set attribute.
		this.setAttribute( 'step', step.toString() );
	}

	/**
	 * Get value.
	 *
	 * @return {number} The value.
	 */
	get value(): number {
		// Get value from input.
		return parseInt( this.querySelector( 'tp-number-spinner-input input' )?.getAttribute( 'value' ) ?? '0' );
	}

	/**
	 * Set current value.
	 *
	 * @param {number} value Current value.
	 */
	set value( value: number ) {
		// Set input's value.
		this.querySelector( 'tp-number-spinner-input input' )?.setAttribute( 'value', value.toString() );
	}

	/**
	 * Increment.
	 */
	increment(): void {
		// Calculate new value.
		const currentValue: number = this.value;
		const max: number | null = this.max;
		const newValue: number = currentValue + this.step;

		// Check if new value is greater than the maximum.
		if ( max && newValue > max ) {
			// Yes, that's not allowed.
			return;
		}

		// No, set its value.
		this.value = newValue;
	}

	/**
	 * Decrement.
	 */
	decrement(): void {
		// Calculate new value.
		const currentValue: number = this.value;
		const min: number | null = this.min;
		const newValue: number = currentValue - this.step;

		// Check if new value is less than the minumum.
		if ( min && newValue < min ) {
			// Yes, that's not allowed.
			return;
		}

		// No, set its value.
		this.value = newValue;
	}
}
