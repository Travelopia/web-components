/**
 * TP Modal.
 */
export class TPModalElement extends HTMLElement {
	/**
	 * Constructor.
	 */
	constructor() {
		super();

		// Move modal as a direct descendent of body to avoid z-index issues.
		document.querySelector( 'body' )?.appendChild( this );

		// Event listeners.
		this.addEventListener( 'click', this.handleClick.bind( this ) );
	}

	/**
	 * Open the modal.
	 */
	open(): void {
		this.dispatchEvent( new CustomEvent( 'before-open', { bubbles: true } ) );
		this.setAttribute( 'open', 'yes' );
		this.dispatchEvent( new CustomEvent( 'open', { bubbles: true } ) );
	}

	/**
	 * Close the modal.
	 */
	close(): void {
		this.dispatchEvent( new CustomEvent( 'before-close', { bubbles: true } ) );
		this.removeAttribute( 'open' );
		this.dispatchEvent( new CustomEvent( 'close', { bubbles: true } ) );
	}

	/**
	 * Handle when the component is clicked.
	 *
	 * @param {Event} e Event.
	 */
	handleClick( e: Event ): void {
		if ( e.target === this && 'yes' === this.getAttribute( 'overlay-click-close' ) ) {
			e.preventDefault();
			e.stopPropagation();
			this.close();
		}
	}
}
