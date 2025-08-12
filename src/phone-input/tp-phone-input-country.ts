/**
 * Internal dependencies.
 */
import { TPPhoneInputElement } from './tp-phone-input';

/**
 * TP Phone Input Country.
 */
export class TPPhoneInputCountryElement extends HTMLElement {
	/**
	 * Constructor.
	 */
	constructor() {
		// Initialize parent.
		super();

		// Events.
		this.querySelector( 'button' )?.addEventListener( 'click', this.select.bind( this ) );
	}

	/**
	 * Select this country.
	 */
	select(): void {
		// Get parent instance.
		const phoneInput: TPPhoneInputElement | null = this.closest( 'tp-phone-input' );

		// Validate if all attributes exist.
		if ( this.getAttribute( 'country-code' ) && this.getAttribute( 'phone-code' ) && this.getAttribute( 'country' ) ) {
			// Update parent's value.
			phoneInput?.setAttribute( 'country-code', <string> this.getAttribute( 'country-code' ) );
			phoneInput?.setAttribute( 'phone-code', <string> this.getAttribute( 'phone-code' ) );
			phoneInput?.setAttribute( 'country', <string> this.getAttribute( 'country' ) );
		}

		// Close dropdown.
		phoneInput?.removeAttribute( 'open' );
	}
}
