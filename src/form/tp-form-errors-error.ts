/**
 * TP Form Errors Error.
 */
export class TPFormErrorsErrorElement extends HTMLElement {
	/**
	 * Constructor.
	 */
	constructor() {
		// Initialize parent.
		super();

		// Add click handler to prevent hash in URL.
		this.querySelector( 'a' )?.addEventListener( 'click', this.handleClick.bind( this ) );
	}

	/**
	 * Handle click on error link.
	 *
	 * @param {Event} event Click event.
	 */
	protected handleClick( event: Event ): void {
		// Prevent default to avoid hash in URL.
		event.preventDefault();

		// Get the field ID from href.
		const target = event.target as HTMLElement;
		const href = target.getAttribute( 'href' ) ?? '';
		const fieldId = href.replace( '#', '' );

		// Focus the target field.
		if ( fieldId ) {
			const targetField = document.getElementById( fieldId );
			targetField?.focus();
		}
	}
}
