/**
 * TP Phone Input Phone Code.
 */
export class TPPhoneInputPhoneCodeElement extends HTMLElement {
	/**
	 * Get observed attributes.
	 *
	 * @return {Array} List of observed attributes.
	 */
	static get observedAttributes(): string[] {
		// Observed attributes.
		return [ 'phone-code' ];
	}

	/**
	 * Attribute changed callback.
	 *
	 * @param {string} oldValue Old value.
	 * @param {string} newValue New value.
	 */
	attributeChangedCallback( oldValue: string = '', newValue: string = '' ): void {
		// Update code.
		if ( oldValue !== newValue ) {
			this.innerText = `+${ this.getAttribute( 'phone-code' ) }`;
		}
	}
}
