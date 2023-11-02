/**
 * TP Modal.
 */
export class TPModalElement extends HTMLElement {
	/**
	 * Constructor.
	 */
	constructor() {
		super();
		document.querySelector( 'body' )?.appendChild( this );
	}

	/**
	 * Connected callback.
	 */
	connectedCallback(): void {
		this.addEventListener( 'click', this.handleClick.bind( this ) );
	}

	/**
	 * Open the modal.
	 */
	open(): void {
		this.setAttribute( 'open', 'yes' );
	}

	/**
	 * Close the modal.
	 */
	close(): void {
		this.removeAttribute( 'open' );
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
