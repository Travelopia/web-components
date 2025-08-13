/**
 * Internal dependencies.
 */
import { TPPhoneInputElement } from './tp-phone-input';
import { TPPhoneInputCountryElement } from './tp-phone-input-country';

/**
 * TP Phone Input Field.
 */
export class TPPhoneInputFieldElement extends HTMLElement {
	/**
	 * Properties.
	 */
	protected readonly input: HTMLInputElement | null;
	protected readonly phoneInput: TPPhoneInputElement | null;
	protected originalPlaceholder: string = '';

	/**
	 * Constructor.
	 */
	constructor() {
		// Initialize parent.
		super();

		// Elements.
		this.input = this.querySelector( ':scope > input[type="tel"]' );
		this.phoneInput = this.closest( 'tp-phone-input' );

		// Save original placeholder.
		if ( this.input ) {
			this.originalPlaceholder = this.input.placeholder ?? '';
		}

		// Events.
		this.input?.addEventListener( 'input', this.handleInput.bind( this ) );
	}

	/**
	 * Get observed attributes.
	 *
	 * @return {Array} List of observed attributes.
	 */
	static get observedAttributes(): string[] {
		// Observed attributes.
		return [ 'country-code' ];
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

		// Update display when attributes change.
		this.update();
	}

	/**
	 * Update.
	 */
	update(): void {
		// Check if we have our field.
		if ( ! this.input ) {
			// Bail early.
			return;
		}

		// Get format.
		const format: string = this.getFormat();

		// Check if we found a format.
		if ( '' !== format ) {
			this.input.placeholder = format.replace( /#/g, '0' );
		} else {
			this.input.placeholder = this.originalPlaceholder;
		}
	}

	/**
	 * Handle input change.
	 */
	handleInput(): void {
		// Check for both inputs.
		if ( ! this.input || ! this.phoneInput ) {
			// Bail early.
			return;
		}

		// Update values.
		const numbersOnly: string = this.input.value.replace( /\D/g, '' );
		this.input.value = this.formatPhoneNumber( numbersOnly, this.getFormat() );
		this.phoneInput.value = numbersOnly;
	}

	/**
	 * Get format.
	 *
	 * @return {string} The format from the current country.
	 */
	getFormat(): string {
		// Get country.
		const country: TPPhoneInputCountryElement | null | undefined =
			this.phoneInput
				?.querySelector( `tp-phone-input-country[country-code="${ this.getAttribute( 'country-code' ) ?? '' }"]` );

		// Return country's format.
		return country?.getAttribute( 'format' ) ?? '';
	}

	/**
	 * Format phone number based on format pattern.
	 *
	 * @param {string} value  Phone number value.
	 * @param {string} format Format pattern.
	 *
	 * @return {string} Formatted phone number.
	 */
	protected formatPhoneNumber( value: string = '', format: string = '' ): string {
		// Prepare variables.
		let result: string = '';
		let valueIndex: number = 0;

		// Go through the entire format string.
		for ( let i = 0; i < format.length; i++ ) {
			const maskCharacter = format[ i ];

			// Is this a mask character?
			if ( '#' === maskCharacter ) {
				// If we have a digit available, insert it; otherwise stop formatting.
				if ( valueIndex < value.length ) {
					result += value[ valueIndex ];
					valueIndex++;
				} else {
					break;
				}
			} else if ( value.length > 0 ) {
				// Only append literals if at least one digit is present or the user has started typing.
				result += maskCharacter;
			}
		}

		// Return formatted phone number.
		return result;
	}
}
