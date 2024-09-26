/**
 * Internal dependencies.
 */

/**
 * TP Phone Input.
 */
export class TPPhoneInputElement extends HTMLElement {
	/**
	 * Properties.
	 */
	protected phoneInputElement: HTMLInputElement | null;

	/**
	 * Constructor.
	 */
	constructor() {
		// Initialize parent.
		super();
		this.phoneInputElement = this.querySelector( 'input[type="tel"]' );

		// Initialize component.
		this.initialize();
	}

	/**
	 * Initialize component.
	 */
	initialize(): void {
		// Create phone input element if it doesn't exist.
		if ( ! this.phoneInputElement ) {
			this.phoneInputElement = document.createElement( 'input' );
			this.phoneInputElement.type = 'tel';
			this.phoneInputElement.setAttribute( 'name', this.getAttribute( 'name' ) ?? '' );
			const countryCode = this.getAttribute( 'code' );
			const formReference = this.getAttribute( 'form' );

			// Add form reference.
			if ( formReference ) {
				this.phoneInputElement.setAttribute( 'form', formReference );
			}

			// Set country code.
			if ( countryCode ) {
				this.phoneInputElement.setAttribute( 'data-country', countryCode );
			}

			// Append.
			this.append( this.phoneInputElement );
		} else {
			this.phoneInputElement.innerHTML = '';
		}
	}
}

/**
 * TP Phone Input Country.
 */
class TPPhoneInputCountry extends HTMLElement {
	constructor() {
		// Initialize parent.
		super();
	}
}

/**
 * TP Phone Input Toggle.
 */
class TPPhoneInputToggle extends HTMLElement {
	constructor() {
		// Initialize parent.
		super();

		// Events.
		this.addEventListener( 'click', this.toggleCountriesDropdown.bind( this ) );
	}

	/**
	 * Toggle Countries Dropdown.
	 *
	 * @param {Event} e Click event.
	 */
	protected toggleCountriesDropdown( e: Event ): void {
		// First, prevent propagation to avoid document.click set on `tp-multi-select`.
		e.preventDefault();
		e.stopPropagation();

		// Now send the event so other stuff can work as per normal, and another event for good measure.
		this.dispatchEvent( new CustomEvent( 'phone-input-toggle' ) );
		document.dispatchEvent( new Event( 'click' ) );

		// Set dropdown open
		this.closest( 'tp-phone-input' )?.setAttribute( 'country-dropdown', 'open' );
	}
}

/**
 * TP Phone Input Field.
 */
class TPPhoneInputField extends HTMLElement {
	constructor() {
		// Initialize parent.
		super();
	}
}

/**
 * TP Phone Input Select.
 */
class TPPhoneInputSelect extends HTMLElement {
	constructor() {
		// Initialize parent.
		super();
	}
}

// Define elements.
customElements.define( 'tp-phone-input-country', TPPhoneInputCountry );
customElements.define( 'tp-phone-input-toggle', TPPhoneInputToggle );
customElements.define( 'tp-phone-input-field', TPPhoneInputField );
customElements.define( 'tp-phone-input-select', TPPhoneInputSelect );
