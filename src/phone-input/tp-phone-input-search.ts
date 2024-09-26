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
	protected handleSearchQuery( e: Event ): void {
		// First, prevent propagation.
		e.preventDefault();
		e.stopPropagation();

		// Now send the event so other stuff can work as per normal, and another event for good measure.
		this.dispatchEvent( new CustomEvent( 'phone-input-select-toggle' ) );
		document.dispatchEvent( new Event( 'click' ) );

		// Set country dropdowm attribute.
		this.setAttribute( 'country-dropdown', 'open' );
	}
}
