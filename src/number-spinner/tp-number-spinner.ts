/**
 * TP Number Spinner Element.
 */
export class TPNumberSpinner extends HTMLElement {
	/**
	 * Connected callback.
	 */
	connectedCallback(): void {
		// Set up ARIA attributes.
		this.setupAria();
	}

	/**
	 * Check if ARIA management is enabled.
	 *
	 * @return {boolean} Whether ARIA is enabled.
	 */
	isAriaEnabled(): boolean {
		// Return whether ARIA management is enabled (default: yes).
		return 'no' !== this.getAttribute( 'aria' );
	}

	/**
	 * Get the input element.
	 *
	 * @return {HTMLInputElement|null} The input element.
	 */
	getInput(): HTMLInputElement | null {
		// Return the input element.
		return this.querySelector( 'tp-number-spinner-input input' );
	}

	/**
	 * Set up ARIA attributes on the input.
	 */
	setupAria(): void {
		// Check if ARIA is enabled.
		if ( ! this.isAriaEnabled() ) {
			// Early return.
			return;
		}

		// Get the input element.
		const input: HTMLInputElement | null = this.getInput();

		// Bail if no input.
		if ( ! input ) {
			// Early return.
			return;
		}

		// Set role="spinbutton" on input if not already set.
		if ( ! input.hasAttribute( 'role' ) ) {
			input.setAttribute( 'role', 'spinbutton' );
		}

		// Set tabindex="-1" on buttons if not already set.
		this.setupButtonTabindex();

		// Add keyboard event listener for arrow keys and Home/End.
		input.addEventListener( 'keydown', this.handleInputKeydown.bind( this ) );

		// Set initial ARIA attributes.
		this.updateAriaAttributes();
	}

	/**
	 * Set tabindex="-1" on buttons if not already set by consumer.
	 */
	setupButtonTabindex(): void {
		// Get buttons.
		const decrementButton: HTMLButtonElement | null = this.querySelector( 'tp-number-spinner-decrement button' );
		const incrementButton: HTMLButtonElement | null = this.querySelector( 'tp-number-spinner-increment button' );

		// Set tabindex on decrement button if not already set.
		if ( decrementButton && ! decrementButton.hasAttribute( 'tabindex' ) ) {
			decrementButton.setAttribute( 'tabindex', '-1' );
		}

		// Set tabindex on increment button if not already set.
		if ( incrementButton && ! incrementButton.hasAttribute( 'tabindex' ) ) {
			incrementButton.setAttribute( 'tabindex', '-1' );
		}
	}

	/**
	 * Handle keydown events on the input.
	 *
	 * @param {KeyboardEvent} event The keyboard event.
	 */
	handleInputKeydown( event: KeyboardEvent ): void {
		// Handle arrow keys and Home/End.
		switch ( event.key ) {
			// Arrow Up: Increment value.
			case 'ArrowUp':
				event.preventDefault();
				this.increment();
				break;

			// Arrow Down: Decrement value.
			case 'ArrowDown':
				event.preventDefault();
				this.decrement();
				break;

			// Home: Go to minimum value.
			case 'Home':

				// Check if min is defined.
				if ( null !== this.min ) {
					event.preventDefault();
					this.value = this.min;
				}
				break;

			// End: Go to maximum value.
			case 'End':

				// Check if max is defined.
				if ( null !== this.max ) {
					event.preventDefault();
					this.value = this.max;
				}
				break;
		}
	}

	/**
	 * Update ARIA attributes on input and buttons.
	 */
	updateAriaAttributes(): void {
		// Check if ARIA is enabled.
		if ( ! this.isAriaEnabled() ) {
			// Early return.
			return;
		}

		// Get the input element.
		const input: HTMLInputElement | null = this.getInput();

		// Bail if no input.
		if ( ! input ) {
			// Early return.
			return;
		}

		// Get current value and limits.
		const currentValue: number = this.value;
		const min: number | null = this.min;
		const max: number | null = this.max;

		// Set aria-valuenow.
		input.setAttribute( 'aria-valuenow', currentValue.toString() );

		// Set aria-valuemin if min is defined.
		if ( null !== min ) {
			input.setAttribute( 'aria-valuemin', min.toString() );
		}

		// Set aria-valuemax if max is defined.
		if ( null !== max ) {
			input.setAttribute( 'aria-valuemax', max.toString() );
		}

		// Update button states.
		this.updateButtonStates( currentValue, min, max );
	}

	/**
	 * Update aria-disabled state on buttons.
	 *
	 * @param {number}      currentValue Current value.
	 * @param {number|null} min          Minimum value.
	 * @param {number|null} max          Maximum value.
	 */
	updateButtonStates( currentValue: number, min: number | null, max: number | null ): void {
		// Get buttons.
		const decrementButton: HTMLButtonElement | null = this.querySelector( 'tp-number-spinner-decrement button' );
		const incrementButton: HTMLButtonElement | null = this.querySelector( 'tp-number-spinner-increment button' );

		// Update decrement button.
		if ( decrementButton ) {
			// Check if at minimum.
			if ( null !== min && currentValue <= min ) {
				decrementButton.setAttribute( 'aria-disabled', 'true' );
			} else {
				decrementButton.removeAttribute( 'aria-disabled' );
			}
		}

		// Update increment button.
		if ( incrementButton ) {
			// Check if at maximum.
			if ( null !== max && currentValue >= max ) {
				incrementButton.setAttribute( 'aria-disabled', 'true' );
			} else {
				incrementButton.removeAttribute( 'aria-disabled' );
			}
		}
	}

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

		// Update ARIA attributes.
		this.updateAriaAttributes();
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
