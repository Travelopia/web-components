/**
 * TP Multi Select Status.
 */
export class TPMultiSelectStatusElement extends HTMLElement {
	/**
	 * Get observed attributes.
	 *
	 * @return {Array} List of observed attributes.
	 */
	static get observedAttributes(): string[] {
		return [ 'total', 'format' ];
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
		const format: string = this.getAttribute( 'format' ) ?? '$total Selected';
		this.innerHTML = format.replace( '$total', this.getAttribute( 'total' ) ?? '' );
	}
}
