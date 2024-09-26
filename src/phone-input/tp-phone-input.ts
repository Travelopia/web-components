/**
 * Internal dependencies.
 */
import { getCountries } from "./actions";

/**
 * TP Phone Input.
 */
export class TPPhoneInputElement extends HTMLElement {
	/**
	 * Properties.
	 */
	protected phoneInputElement: HTMLInputElement | null;
	protected phoneInputCountriesElement: HTMLElement | null;

	/**
	 * Constructor.
	 */
	constructor() {
		// Initialize parent.
		super();
		this.phoneInputElement = this.querySelector( 'input[type="tel"]' );
		this.phoneInputCountriesElement = this.querySelector( 'tp-phone-input-countries' );

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

		// Render Countries.
		this.renderCountries();
	}

	/**
	 * Render component.
	 */
	renderCountries(): void {
		if ( ! this.phoneInputCountriesElement ) {
			return;
		}

		// Get the countries.
		const countries = getCountries();
		if ( ! countries ) {
			return;
		}

		countries.forEach( ( country ) => {
			const countryElement = document.createElement( 'tp-phone-input-country' );
			countryElement.setAttribute( 'code', country.code );
			countryElement.setAttribute( 'prefix', country.prefix );
			countryElement.innerHTML = `<button>(${country.prefix}) ${country.name}</button>`;
			this.phoneInputCountriesElement?.appendChild( countryElement );
		} );
	}
}
