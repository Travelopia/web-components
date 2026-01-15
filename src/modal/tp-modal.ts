/**
 * Focusable elements selector.
 */
const FOCUSABLE_ELEMENTS = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * TP Modal.
 */
export class TPModalElement extends HTMLElement {
	/**
	 * Previously focused element before modal opened.
	 */
	private previouslyFocusedElement: HTMLElement | null = null;

	/**
	 * Elements that were made inert when modal opened.
	 */
	private inertedElements: Element[] = [];

	/**
	 * Bound event handlers for cleanup.
	 */
	private readonly boundHandleKeyDown: ( e: KeyboardEvent ) => void;

	/**
	 * Constructor.
	 */
	constructor() {
		// Initialize parent.
		super();

		// Make modal programmatically focusable for focus management.
		if ( ! this.hasAttribute( 'tabindex' ) ) {
			this.setAttribute( 'tabindex', '-1' );
		}

		// Bind event handlers.
		this.boundHandleKeyDown = this.handleKeyDown.bind( this );

		// Move modal as a direct descendent of body to avoid z-index issues.
		document.querySelector( 'body' )?.appendChild( this );

		// Event listeners.
		this.addEventListener( 'click', this.handleClick.bind( this ) );
	}

	/**
	 * Open the modal.
	 */
	open(): void {
		// Save the currently focused element to restore later.
		this.previouslyFocusedElement = this.ownerDocument.activeElement as HTMLElement;

		// Dispatch before-open event and set open attribute.
		this.dispatchEvent( new CustomEvent( 'before-open', { bubbles: true } ) );
		this.setAttribute( 'open', 'yes' );

		// Make all siblings inert to trap focus and hide from AT.
		this.setSiblingsInert( true );

		// Add keyboard event listener for Escape and focus trap.
		document.addEventListener( 'keydown', this.boundHandleKeyDown );

		// Move focus into the modal (enabled by default, disable with manage-focus="no").
		if ( 'no' !== this.getAttribute( 'manage-focus' ) ) {
			this.setInitialFocus();
		}

		// Dispatch open event.
		this.dispatchEvent( new CustomEvent( 'open', { bubbles: true } ) );
	}

	/**
	 * Close the modal.
	 */
	close(): void {
		// Remove keyboard event listener.
		document.removeEventListener( 'keydown', this.boundHandleKeyDown );

		// Dispatch before-close event and remove open attribute.
		this.dispatchEvent( new CustomEvent( 'before-close', { bubbles: true } ) );
		this.removeAttribute( 'open' );

		// Restore siblings from inert state.
		this.setSiblingsInert( false );

		// Restore focus to the previously focused element (if manage-focus is enabled).
		if ( 'no' !== this.getAttribute( 'manage-focus' ) && this.previouslyFocusedElement ) {
			this.previouslyFocusedElement.focus();
			this.previouslyFocusedElement = null;
		}

		// Dispatch close event.
		this.dispatchEvent( new CustomEvent( 'close', { bubbles: true } ) );
	}

	/**
	 * Set initial focus when modal opens.
	 * Looks for [autofocus] element, otherwise focuses the modal container.
	 */
	private setInitialFocus(): void {
		// Look for an element with autofocus attribute.
		const autofocusElement = this.querySelector<HTMLElement>( '[autofocus]' );

		// Do we have an autofocus element?
		if ( autofocusElement ) {
			autofocusElement.focus();

			// Early return.
			return;
		}

		// Otherwise, focus the modal container itself.
		this.focus();
	}

	/**
	 * Set or remove inert and aria-hidden on all siblings.
	 *
	 * @param {boolean} inert Whether to make siblings inert.
	 */
	private setSiblingsInert( inert: boolean ): void {
		// Get all body children except this modal.
		const bodyChildren = document.body.children;

		// Should we make them inert?
		if ( inert ) {
			// Clear any previously stored elements.
			this.inertedElements = [];

			// Loop through body children and set inert.
			for ( let i = 0; i < bodyChildren.length; i++ ) {
				const element = bodyChildren[ i ];

				// Skip this modal and script/style elements.
				if ( element === this || 'SCRIPT' === element.tagName || 'STYLE' === element.tagName ) {
					continue;
				}

				// Set inert and aria-hidden, store reference for cleanup.
				element.setAttribute( 'inert', '' );
				element.setAttribute( 'aria-hidden', 'true' );
				this.inertedElements.push( element );
			}
		} else {
			// Remove inert and aria-hidden from previously inerted elements.
			for ( const element of this.inertedElements ) {
				element.removeAttribute( 'inert' );
				element.removeAttribute( 'aria-hidden' );
			}

			// Clear stored elements.
			this.inertedElements = [];
		}
	}

	/**
	 * Handle keydown events for Escape and focus trap.
	 *
	 * @param {KeyboardEvent} e Keyboard event.
	 */
	private handleKeyDown( e: KeyboardEvent ): void {
		// Close on Escape.
		if ( 'Escape' === e.key ) {
			e.preventDefault();
			this.close();

			// Early return.
			return;
		}

		// Handle focus trap on Tab (enabled by default, disable with focus-trap="no").
		if ( 'Tab' === e.key && 'no' !== this.getAttribute( 'focus-trap' ) ) {
			this.trapFocus( e );
		}
	}

	/**
	 * Trap focus within the modal.
	 *
	 * @param {KeyboardEvent} e Keyboard event.
	 */
	private trapFocus( e: KeyboardEvent ): void {
		// Get all focusable elements within the modal.
		const focusableElements = this.querySelectorAll<HTMLElement>( FOCUSABLE_ELEMENTS );

		// Do we have focusable elements?
		if ( 0 === focusableElements.length ) {
			e.preventDefault();

			// Early return.
			return;
		}

		// Get first, last, and currently focused elements.
		const firstElement = focusableElements[ 0 ];
		const lastElement = focusableElements[ focusableElements.length - 1 ];
		const activeElement = this.ownerDocument.activeElement;

		// Shift+Tab on first element: move to last.
		if ( e.shiftKey && activeElement === firstElement ) {
			e.preventDefault();
			lastElement.focus();

			// Early return.
			return;
		}

		// Tab on last element: move to first.
		if ( ! e.shiftKey && activeElement === lastElement ) {
			e.preventDefault();
			firstElement.focus();
		}
	}

	/**
	 * Handle when the component is clicked.
	 *
	 * @param {Event} e Event.
	 */
	handleClick( e: Event ): void {
		// Close on overlay click.
		if ( e.target === this && 'yes' === this.getAttribute( 'overlay-click-close' ) ) {
			e.preventDefault();
			e.stopPropagation();
			this.close();
		}
	}
}
