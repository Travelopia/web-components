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

		// Use event delegation to handle clicks on dynamically added anchors.
		this.addEventListener( 'click', this.handleClick.bind( this ) );
	}

	/**
	 * Handle click on error link.
	 *
	 * @param {Event} event Click event.
	 */
	protected handleClick( event: Event ): void {
		// Find the anchor element.
		const target = event.target as HTMLElement;
		const anchor = target.closest( 'a' );

		// Only handle clicks on anchors.
		if ( ! anchor ) {
			// Bail early.
			return;
		}

		// Prevent default to avoid hash in URL.
		event.preventDefault();

		// Get the field ID from href.
		const href = anchor.getAttribute( 'href' ) ?? '';
		const fieldId = href.replace( '#', '' );

		// Focus the target field.
		if ( fieldId ) {
			const targetField = document.getElementById( fieldId );
			targetField?.focus();
		}
	}
}
