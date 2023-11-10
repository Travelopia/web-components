/**
 * TP Slider Count.
 */
export class TPSliderCountElement extends HTMLElement {
	/**
	 * Get observed attributes.
	 *
	 * @return {Array} Observed attributes.
	 */
	static get observedAttributes(): string[] {
		return [ 'current', 'total', 'format' ];
	}

	/**
	 * Get format.
	 *
	 * @return {string} Format.
	 */
	get format(): string {
		return this.getAttribute( 'format' ) ?? '$current / $total';
	}

	/**
	 * Set format.
	 *
	 * @param {string} format Format.
	 */
	set format( format: string ) {
		this.setAttribute( 'format', format );
	}

	/**
	 * Attribute changed callback.
	 */
	attributeChangedCallback(): void {
		this.update();
	}

	/**
	 * Update component.
	 */
	update(): void {
		this.innerHTML =
			this.format
				.replace( '$current', this.getAttribute( 'current' ) ?? '' )
				.replace( '$total', this.getAttribute( 'total' ) ?? '' );
	}
}
