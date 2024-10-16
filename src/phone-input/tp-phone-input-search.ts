/**
 * Internal dependencies.
 */
import { filterCountries } from './actions';

/**
 * TP Phone Input Search.
 */
export class TPPhoneInputSearch extends HTMLElement {
	constructor() {
		// Initialize parent.
		super();

		// get input.
		const input: HTMLInputElement | null = this.querySelector( 'input' );

		// Check if input exists.
		if ( ! input ) {
			// No, its not. Exit.
			return;
		}

		// Events.
		input.addEventListener( 'input', this.handleSearchQuery.bind( this ) );
	}

	/**
	 * Toggle Select Phone Dropdown.
	 */
	protected handleSearchQuery(): void {
		// Get the query input.
		const searchInput = this.querySelector( 'input' );

		// Return if no query input.
		if ( ! searchInput ) {
			// Do nothing.
			return;
		}

		// Search keyword.
		const searchQuery = searchInput.value;
		const countryList = filterCountries( searchQuery );
		const phoneInputCountriesElement = this.closest( 'tp-phone-input' )?.querySelector( 'tp-phone-input-countries' );

		// Bail: if no data or element.
		if ( ! countryList || ! phoneInputCountriesElement ) {
			// Do nothing.
			return;
		}

		// Build filter countries List.
		phoneInputCountriesElement.innerHTML = '';

		// Loop through countries data.
		countryList.forEach( ( country ) => {
			// Create TPPhoneInputCountry element.
			const countryElement = document.createElement( 'tp-phone-input-country' );
			countryElement.setAttribute( 'code', country.code );
			countryElement.setAttribute( 'prefix', country.prefix );
			countryElement.innerHTML = `<button>(${ country.prefix }) ${ country.name }</button>`;
			phoneInputCountriesElement?.appendChild( countryElement );
		} );
	}
}
