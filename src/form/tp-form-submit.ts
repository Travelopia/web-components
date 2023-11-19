/**
 * TP Form Submit.
 */
export class TPFormSubmitElement extends HTMLElement {
	/**
	 * Get observed attributes.
	 *
	 * @return {Array} List of observed attributes.
	 */
	static get observedAttributes(): string[] {
		return [ 'submitting-text', 'original-text', 'submitting' ];
	}

	/**
	 * Attribute changed callback.
	 *
	 * @param {string} _name    Attribute name.
	 * @param {string} oldValue Old value.
	 * @param {string} newValue New value.
	 */
	attributeChangedCallback( _name: string = '', oldValue: string = '', newValue: string = '' ): void {
		if ( oldValue !== newValue ) {
			this.update();
		}
	}

	/**
	 * Update this component.
	 */
	update(): void {
		// Get submit button.
		const submitButton: HTMLButtonElement | null = this.querySelector( 'button[type="submit"]' );
		if ( ! submitButton ) {
			return;
		}

		// Prepare submit button text.
		const submittingText: string = this.getAttribute( 'submitting-text' ) ?? '';
		const originalText: string = this.getAttribute( 'original-text' ) ?? submitButton.innerHTML;

		// Check if we are submitting.
		if ( 'yes' === this.getAttribute( 'submitting' ) ) {
			submitButton.setAttribute( 'disabled', 'disabled' );
			this.setAttribute( 'original-text', originalText );
			submitButton.innerHTML = submittingText;
		} else {
			submitButton.removeAttribute( 'disabled' );
			this.removeAttribute( 'submitting' );
			this.removeAttribute( 'original-text' );
			submitButton.innerHTML = originalText;
		}
	}
}
