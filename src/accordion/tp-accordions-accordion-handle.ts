/**
 * TPAccordionsAccordionHandleElement.
 */
export class TPAccordionsAccordionHandleElement extends HTMLElement {
	connectedCallback() {
		this.addEventListener( 'click',  () => this.toggle() )
	}

	/**
	 * Toggle accordion state.
	 */
	toggle() {
		// Toggle accordion item states.
		this.parentElement?.toggleAttribute( 'open' );
	}

	/**
	 * Open accordion.
	 */
	open() {
		// Set the attributes of the accordion to expand it.
		this.setAttribute( 'open', 'yes' );
	}

	/**
	 * Close accordion.
	 */
	close() {
		// Set the attributes of the accordion to collapse it.
		this.removeAttribute( 'open' );
	}
}
