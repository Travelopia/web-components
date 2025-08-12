/**
 * Internal dependencies.
 */
import { TPPhoneInputElement } from './tp-phone-input';
import { TPPhoneInputCountryElement } from './tp-phone-input-country';

/**
 * TP Phone Input Selected Flag.
 */
export class TpPhoneInputSelectedFlagElement extends HTMLElement {
	/**
	 * Get observed attributes.
	 *
	 * @return {Array} List of observed attributes.
	 */
	static get observedAttributes(): string[] {
		// Observed attributes.
		return [ 'flag' ];
	}

	/**
	 * Attribute changed callback.
	 *
	 * @param {string} oldValue Old value.
	 * @param {string} newValue New value.
	 */
	attributeChangedCallback( oldValue: string = '', newValue: string = '' ): void {
		// Update flag.
		if ( oldValue !== newValue ) {
			this.update();
		}
	}

	/**
	 * Update.
	 */
	update(): void {
		// Get flag.
		const flag = this.getAttribute( 'flag' );

		// Check if we have a valid value.
		if ( ! flag || '' === flag ) {
			// We don't mark as empty.
			this.innerHTML = '';

			// Bail early.
			return;
		}

		// Get parent input.
		const input: TPPhoneInputElement | null = this.closest( 'tp-phone-input' );

		// Find the flag for this country.
		const countryElement: TPPhoneInputCountryElement | null | undefined = input?.querySelector( `tp-phone-input-country[country-code="${ flag }"]` );
		const flagElement = countryElement?.querySelector( 'tp-phone-input-flag' );

		// Check if we found a flag.
		if ( flagElement ) {
			// We did.
			this.innerHTML = flagElement.innerHTML;
		} else {
			// We didn't.
			this.innerHTML = '';
		}
	}
}
