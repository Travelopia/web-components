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
		return [ 'phone-code', 'format' ];
	}

	/**
	 * Attribute changed callback.
	 *
	 * @param {string} _name    Attribute name.
	 * @param {string} oldValue Old value.
	 * @param {string} newValue New value.
	 */
	attributeChangedCallback( _name: string = '', oldValue: string = '', newValue: string = '' ): void {
		// Update code.
		if ( oldValue !== newValue ) {
			const format: string = this.getAttribute( 'format' ) ?? '';
			this.innerText = `${ format.replace( '$code', this.getAttribute( 'phone-code' ) ?? '' ) }`;
		}
	}
}
