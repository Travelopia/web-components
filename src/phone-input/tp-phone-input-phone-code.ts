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
		return [ 'value' ];
	}

	/**
	 * Attribute changed callback.
	 *
	 * @param {string} oldValue Old value.
	 * @param {string} newValue New value.
	 */
	attributeChangedCallback( oldValue: string = '', newValue: string = '' ): void {
		// If no changes.
		if ( ! newValue || oldValue === newValue ) {
			// Exit.
			return;
		}

		// Update value.
		this.innerText = `+${ newValue }`;
	}
}
