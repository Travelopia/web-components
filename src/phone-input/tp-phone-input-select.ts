/**
 * TP Phone Input Select.
 */
export class TPPhoneInputSelect extends HTMLElement {
	constructor() {
		// Initialize parent.
		super();

		// Events.
		this.addEventListener( 'click', this.toggleSelectPhoneDropdown.bind( this ) );
	}

	/**
	 * Toggle Select Phone Dropdown.
	 *
	 * @param {Event} e Click event.
	 */
	protected toggleSelectPhoneDropdown( e: Event ): void {
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
