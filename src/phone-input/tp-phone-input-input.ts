/**
 * TP Phone Input Input.
 */
export class TPPhoneInputInputElement extends HTMLElement {
	/**
	 * Properties.
	 */
	protected readonly phoneInput: HTMLInputElement | null;
	protected readonly phoneCode: HTMLElement | null;

	/**
	 * Constructor.
	 */
	constructor() {
		// Initialize parent.
		super();

		// Get elements.
		this.phoneInput = this.querySelector( 'input[type="tel"]' );
		this.phoneCode = this.querySelector( 'tp-phone-input-phone-code' );

		// Add event listeners.
		this.phoneInput?.addEventListener( 'input', this.handlePhoneInput.bind( this ) );
		this.phoneInput?.addEventListener( 'keydown', this.handlePhoneKeydown.bind( this ) );

		// Initialize component.
		this.initialize();
	}

	/**
	 * Initialize component.
	 */
	protected initialize(): void {
		// Set initial state based on attributes.
		this.updatePhoneInputValidation();
	}

	/**
	 * Handle phone input.
	 *
	 * @param {Event} e Input event.
	 */
	protected handlePhoneInput( e: Event ): void {
		const input = e.target as HTMLInputElement;
		const value = input.value.replace( /\D/g, '' ); // Remove non-digits

		// Get current country validation rules.
		const phoneInput = this.closest( 'tp-phone-input' );
		const currentCountry = phoneInput?.querySelector( `tp-phone-input-country[value="${ phoneInput.getAttribute( 'value' ) }"]` );
		const minLength = currentCountry?.getAttribute( 'min-length' );
		const maxLength = currentCountry?.getAttribute( 'max-length' );
		const format = currentCountry?.getAttribute( 'format' );

		// Validate length.
		if ( minLength && value.length < parseInt( minLength ) ) {
			input.setCustomValidity( `Phone number must be at least ${ minLength } digits` );
		} else if ( maxLength && value.length > parseInt( maxLength ) ) {
			input.setCustomValidity( `Phone number must be no more than ${ maxLength } digits` );
		} else {
			input.setCustomValidity( '' );
		}

		// Format the input if format is specified.
		if ( format && value.length > 0 ) {
			const formattedValue = this.formatPhoneNumber( value, format );
			if ( formattedValue !== input.value ) {
				input.value = formattedValue;
			}
		}

		// Update placeholder based on format.
		if ( format ) {
			input.placeholder = this.getPlaceholderFromFormat( format );
		}
	}

	/**
	 * Handle phone keydown.
	 *
	 * @param {KeyboardEvent} e Keydown event.
	 */
	protected handlePhoneKeydown( e: KeyboardEvent ): void {
		// Allow: backspace, delete, tab, escape, enter, and navigation keys.
		if ( [ 8, 9, 27, 13, 46, 37, 38, 39, 40 ].includes( e.keyCode ) ) {
			return;
		}

		// Allow only digits.
		if ( ! /^\d$/.test( e.key ) ) {
			e.preventDefault();
		}
	}

	/**
	 * Format phone number based on format pattern.
	 *
	 * @param {string} value  Phone number value.
	 * @param {string} format Format pattern.
	 * @return {string} Formatted phone number.
	 */
	protected formatPhoneNumber( value: string, format: string ): string {
		let result = '';
		let valueIndex = 0;

		for ( let i = 0; i < format.length && valueIndex < value.length; i++ ) {
			if ( format[ i ] === '#' ) {
				result += value[ valueIndex ];
				valueIndex++;
			} else {
				result += format[ i ];
			}
		}

		return result;
	}

	/**
	 * Get placeholder from format pattern.
	 *
	 * @param {string} format Format pattern.
	 * @return {string} Placeholder text.
	 */
	protected getPlaceholderFromFormat( format: string ): string {
		return format.replace( /#/g, '0' );
	}

	/**
	 * Update phone input validation.
	 */
	protected updatePhoneInputValidation(): void {
		if ( ! this.phoneInput ) return;

		const phoneInput = this.closest( 'tp-phone-input' );
		const currentCountry = phoneInput?.querySelector( `tp-phone-input-country[value="${ phoneInput.getAttribute( 'value' ) }"]` );
		const minLength = currentCountry?.getAttribute( 'min-length' );
		const maxLength = currentCountry?.getAttribute( 'max-length' );
		const format = currentCountry?.getAttribute( 'format' );

		// Set input attributes.
		if ( minLength ) {
			this.phoneInput.setAttribute( 'minlength', minLength );
		}
		if ( maxLength ) {
			this.phoneInput.setAttribute( 'maxlength', maxLength );
		}

		// Update placeholder.
		if ( format ) {
			this.phoneInput.placeholder = this.getPlaceholderFromFormat( format );
		}
	}

	/**
	 * Get observed attributes.
	 *
	 * @return {Array} List of observed attributes.
	 */
	static get observedAttributes(): string[] {
		return [ 'value' ];
	}

	/**
	 * Attribute changed callback.
	 *
	 * @param {string} _name    Attribute name.
	 * @param {string} oldValue Old value.
	 * @param {string} newValue New value.
	 */
	attributeChangedCallback( _name: string = '', oldValue: string = '', newValue: string = '' ): void {
		// If no changes.
		if ( oldValue === newValue ) {
			// Exit.
			return;
		}

		// Update phone input validation when value changes.
		this.updatePhoneInputValidation();
	}
}
