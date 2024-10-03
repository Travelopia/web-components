/**
 * Internal dependencies.
 */
import { filterCountries } from "./actions";

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
	 *
	 * @param {Event} e Click event.
	 */
	protected handleSearchQuery(): void {
		const searchInput = this.querySelector( 'input' );
		if ( ! searchInput ) {
			return;
		}

		// Search keyword.
		const searchQuery = searchInput.value;
		const countryList = filterCountries( searchQuery );
		const phoneInputCountriesElement = this.closest( 'tp-phone-input' )?.querySelector( 'tp-phone-input-countries' );

		if ( ! countryList || ! phoneInputCountriesElement ) {
			return;
		}

		// Build filter countries List.
		phoneInputCountriesElement.innerHTML = '';
		countryList.forEach( ( country ) => {
			const countryElement = document.createElement( 'tp-phone-input-country' );
			countryElement.setAttribute( 'code', country.code );
			countryElement.setAttribute( 'prefix', country.prefix );
			countryElement.innerHTML = `<button>(${country.prefix}) ${country.name}</button>`;
			phoneInputCountriesElement?.appendChild( countryElement );
		} );
	}
}
