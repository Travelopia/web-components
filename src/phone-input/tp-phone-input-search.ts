/**
 * Internal dependencies.
 */
import { TPPhoneInputElement } from './tp-phone-input';
import { TPPhoneInputCountryListElement } from './tp-phone-input-country-list';

/**
 * TP Phone Input Search.
 */
export class TPPhoneInputSearchElement extends HTMLElement {
	/**
	 * Properties.
	 */
	protected input: HTMLInputElement | null;
	protected phoneInput: TPPhoneInputElement | null;
	protected countryList: TPPhoneInputCountryListElement | null;

	/**
	 * Constructor.
	 */
	constructor() {
		// Initialize parent.
		super();

		// Elements.
		this.input = this.querySelector( 'input' );
		this.phoneInput = this.closest( 'tp-phone-input' );
		this.countryList = this.phoneInput?.querySelector( 'tp-phone-input-country-list' ) ?? null;

		// Events.
		this.input?.addEventListener( 'keydown', this.handleKeyboardInputs.bind( this ) );
		this.input?.addEventListener( 'input', this.handleSearchChange.bind( this ) );
	}

	/**
	 * Handle keyboard inputs.
	 *
	 * @param {Event} e Keyboard event.
	 */
	handleKeyboardInputs( e: KeyboardEvent ): void {
		// Handle keyboard inputs.
		switch ( e.key ) {
			case 'Enter':
				e.preventDefault(); // Prevent inadvertent form submits.
				break;
			case 'ArrowDown':
				this.countryList?.handleDownArrow();
				break;
			case 'ArrowUp':
				this.countryList?.handleUpArrow();
				break;
			case 'Escape':
				this.phoneInput?.removeAttribute( 'open' );
				break;
		}
	}

	/**
	 * Handle search field value changed.
	 */
	protected handleSearchChange(): void {
		// Get search field and countries.
		const phoneInput: TPPhoneInputElement | null = this.closest( 'tp-phone-input' );
		const search: HTMLInputElement | null = this.querySelector( 'input' );
		const countries: NodeListOf<HTMLElement> | undefined = this.closest( 'tp-phone-input' )?.querySelectorAll( 'tp-phone-input-country' );

		// Check if phone input, search, and countries exist.
		if ( ! phoneInput || ! search || ! countries ) {
			// Bail early.
			return;
		}

		// Initialize matched country count.
		let matchedCountryCount = 0;
		countries.forEach( ( country: HTMLElement ): void => {
			// Get country name and value for search.
			const countryName: string = country.getAttribute( 'country' ) || '';
			const countryValue: string = country.getAttribute( 'value' ) || '';
			const searchTerm: string = search.value.toLowerCase();

			// Hide and show countries based on search.
			if ( countryName.toLowerCase().includes( searchTerm ) || countryValue.toLowerCase().includes( searchTerm ) ) {
				country.removeAttribute( 'hidden' );
				matchedCountryCount++;
			} else {
				country.setAttribute( 'hidden', 'yes' );
			}
		} );

		// Show matched country count.
		phoneInput.setAttribute( 'visible-countries', matchedCountryCount.toString() );

		// Keep dropdown open when searching.
		if ( '' !== search.value ) {
			phoneInput.setAttribute( 'open', 'yes' );
		}
	}
}
