/**
 * Internal dependencies.
 */
import { TPPhoneInputElement } from './tp-phone-input';

/**
 * TP Phone Input Search.
 */
export class TPPhoneInputSearchElement extends HTMLElement {
	/**
	 * Constructor.
	 */
	constructor() {
		// Initialize parent.
		super();

		// Get input.
		const input: HTMLInputElement | null = this.querySelector( 'input' );

		// Check if input exists.
		if ( ! input ) {
			// No, its not. Exit.
			return;
		}

		// Add event listeners.
		input.addEventListener( 'keydown', this.handleKeyboardInputs.bind( this ) );
		input.addEventListener( 'keyup', this.handleSearchChange.bind( this ) );
		input.addEventListener( 'input', this.handleSearchChange.bind( this ) );
		this.addEventListener( 'click', this.handleClick.bind( this ) );
		this.closest( 'tp-phone-input' )?.addEventListener( 'open', this.focus.bind( this ) );
	}

	/**
	 * Handle keyboard inputs.
	 *
	 * @param {Event} e Keyboard event.
	 */
	handleKeyboardInputs( e: KeyboardEvent ): void {
		// Get phone input and search field.
		const phoneInput: TPPhoneInputElement | null = this.closest( 'tp-phone-input' );
		const search: HTMLInputElement | null = this.querySelector( 'input' );

		// Check if phone input and search field exists.
		if ( ! phoneInput || ! search ) {
			// Bail early.
			return;
		}

		// Handle keyboard inputs.
		switch ( e.key ) {
			case 'Enter':
				e.preventDefault(); // Prevent inadvertent form submits.
				break;
			case 'ArrowDown':
				phoneInput.setAttribute( 'open', 'yes' );
				break;
			case 'Escape':
				phoneInput.removeAttribute( 'open' );
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

	/**
	 * Handle click.
	 *
	 * @param {Event} e Click event.
	 */
	protected handleClick( e: Event ): void {
		// First, prevent propagation to avoid document.click set on `tp-phone-input`.
		e.preventDefault();
		e.stopPropagation();

		// Now send the event so other stuff can work as per normal.
		this.dispatchEvent( new CustomEvent( 'phone-input-search-clicked' ) );

		// Open phone input dropdown.
		this.closest( 'tp-phone-input' )?.setAttribute( 'open', 'yes' );
	}

	/**
	 * Clear the search field.
	 */
	clear(): void {
		// Clear search field.
		const search: HTMLInputElement | null = this.querySelector( 'input' );

		// Check if search field exists.
		if ( search ) {
			// Set value to empty string and dispatch change event.
			search.value = '';
			search.dispatchEvent( new Event( 'change' ) );
		}
	}

	/**
	 * Set focus on the search field.
	 */
	focus(): void {
		// When it's focused, use search change to ensure the results are refreshed.
		this.handleSearchChange();

		// Focus on input.
		this.querySelector( 'input' )?.focus();
	}
}
