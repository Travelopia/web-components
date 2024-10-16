/**
 * TP Phone Input Country.
 */
export class TPPhoneInputCountry extends HTMLElement {
	constructor() {
		// Initialize parent.
		super();

		// Add event listener for select country.
		this.addEventListener( 'click', this.handleClick.bind( this ) );
	}

	/**
	 * Select country.
	 *
	 * @param {Event} e Click event.
	 */
	handleClick( e: Event | null ): void {
		// Prevent default behavior and stop propagation.
		e?.preventDefault();
		e?.stopPropagation();

		// Get main field wrapper.
		const phoneInput = this.closest( 'tp-phone-input' );
		const phoneInputSelectElement = phoneInput?.querySelector( 'tp-phone-input-select' );
		const phoneInputToggleButton = phoneInput?.querySelector( 'tp-phone-input-toggle button' );
		const selectedCountryPrefix = this.getAttribute( 'prefix' );

		// On select toggle.
		if ( selectedCountryPrefix && phoneInputToggleButton ) {
			phoneInputToggleButton.innerHTML = selectedCountryPrefix.toString();

			// Remove attribute from select input.
			if ( phoneInputSelectElement?.getAttribute( 'country-dropdown' ) ) {
				phoneInputSelectElement.removeAttribute( 'country-dropdown' );
			}
		}

		// Dispatch change event.
		phoneInput?.dispatchEvent( new CustomEvent( 'change', { bubbles: true } ) );
	}
}
