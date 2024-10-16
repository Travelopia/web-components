/**
 * TP Phone Input Toggle.
 */
export class TPPhoneInputToggle extends HTMLElement {
	constructor() {
		// Initialize parent.
		super();

		// Events.
		this.addEventListener( 'click', this.closeSelectPhoneDropdown.bind( this ) );
	}

	/**
	 * Close Select Phone Dropdown.
	 *
	 * @param {Event} e Click event.
	 */
	protected closeSelectPhoneDropdown( e: Event ): void {
		// First, prevent propagation.
		e.preventDefault();
		e.stopPropagation();

		// Get parent tp-phone-input-select.
		const phoneInputSelectElement = this.closest( 'tp-phone-input-select' );

		// toggle select country dropdowm.
		if ( phoneInputSelectElement?.getAttribute( 'country-dropdown' ) ) {
			phoneInputSelectElement.removeAttribute( 'country-dropdown' );
		} else {
			phoneInputSelectElement?.setAttribute( 'country-dropdown', 'open' );
		}
	}
}
