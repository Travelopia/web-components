/**
 * TP Phone Input Countries.
 */
export class TPPhoneInputCountriesElement extends HTMLElement {
	/**
	 * Constructor.
	 */
	constructor() {
		// Initialize parent.
		super();
	}

	/**
	 * Get observed attributes.
	 *
	 * @return {Array} List of observed attributes.
	 */
	static get observedAttributes(): string[] {
		return [ 'open' ];
	}

	/**
	 * Attribute changed callback.
	 *
	 * @param {string} name     Attribute name.
	 * @param {string} oldValue Old value.
	 * @param {string} newValue New value.
	 */
	attributeChangedCallback( name: string = '', oldValue: string = '', newValue: string = '' ): void {
		// If no changes.
		if ( oldValue === newValue ) {
			// Exit.
			return;
		}

		// Handle open attribute changes.
		if ( 'open' === name ) {
			if ( 'yes' === newValue ) {
				// Dispatch open event.
				this.dispatchEvent( new CustomEvent( 'open', { bubbles: true } ) );
			} else {
				// Dispatch close event.
				this.dispatchEvent( new CustomEvent( 'close', { bubbles: true } ) );
			}
		}
	}
}
