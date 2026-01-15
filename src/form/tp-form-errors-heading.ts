/**
 * TP Form Errors Heading.
 *
 * Displays the error count. User controls the heading element wrapper.
 */
export class TPFormErrorsHeadingElement extends HTMLElement {
	/**
	 * Get format.
	 *
	 * @return {string} Format with $count placeholder.
	 */
	get format(): string {
		// Get format.
		return this.getAttribute( 'format' ) ?? '';
	}

	/**
	 * Set format.
	 *
	 * @param {string} format Format string.
	 */
	set format( format: string ) {
		// Set format.
		this.setAttribute( 'format', format );
	}

	/**
	 * Update the heading with the error count.
	 *
	 * @param {number} count Number of errors.
	 */
	update( count: number ): void {
		// Update count.
		this.textContent = this.format.replace( '$count', count.toString() );
	}
}
