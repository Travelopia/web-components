/**
 * Internal dependencies.
 */
import { TPAccordionContentElement } from './tp-accordion-content';
import { TPAccordionElement } from './tp-accordion';
import { slideElementDown, slideElementUp } from '../utility';

/**
 * TP Accordion Item.
 */
export class TPAccordionItemElement extends HTMLElement {
	/**
	 * Constructor.
	 */
	constructor() {
		// Initialize parent.
		super();

		// Check if by default accordion item is open.
		if ( 'yes' === this.getAttribute( 'open-by-default' ) ) {
			this.setAttribute( 'open', 'yes' );
		}

		// ARIA stuff.
		this.setupAriaControls();
		this.updateAriaState( 'yes' === this.getAttribute( 'open' ) );
		this.setupBeforeMatchListener();
	}

	/**
	 * Set up beforematch event listener for find-in-page support.
	 */
	private setupBeforeMatchListener(): void {
		// Get content element.
		const content: TPAccordionContentElement | null = this.querySelector( 'tp-accordion-content' );

		// Bail if no content.
		if ( ! content ) {
			// Early return.
			return;
		}

		// When browser finds content via find-in-page, open this accordion item.
		content.addEventListener( 'beforematch', () => {
			// Open the accordion item.
			this.setAttribute( 'open', 'yes' );
		} );
	}

	/**
	 * Set up aria-controls linkage between button and content.
	 */
	private setupAriaControls(): void {
		// Check if aria management is enabled.
		if ( ! this.isAriaEnabled() ) {
			// Early return.
			return;
		}

		// Get button and content elements.
		const button = this.querySelector( 'tp-accordion-handle button' );
		const content: TPAccordionContentElement | null = this.querySelector( 'tp-accordion-content' );

		// Bail if no button or content.
		if ( ! button || ! content ) {
			// Early return.
			return;
		}

		// Generate ID for content if not present.
		if ( ! content.id ) {
			content.id = `tp-accordion-content-${ Math.random().toString( 36 ).substring( 2, 9 ) }`;
		}

		// Set aria-controls on button if not present.
		if ( ! button.hasAttribute( 'aria-controls' ) ) {
			button.setAttribute( 'aria-controls', content.id );
		}
	}

	/**
	 * Check if ARIA management is enabled.
	 *
	 * @return {boolean} Whether ARIA management is enabled.
	 */
	private isAriaEnabled(): boolean {
		// Get parent accordion.
		const accordion: TPAccordionElement | null = this.closest( 'tp-accordion' );

		// Return whether aria management is enabled.
		return 'no' !== accordion?.getAttribute( 'aria' );
	}

	/**
	 * Update ARIA state for handle button and content.
	 *
	 * @param {boolean} isOpen Whether the accordion item is open.
	 */
	private updateAriaState( isOpen: boolean ): void {
		// Check if aria management is enabled.
		if ( ! this.isAriaEnabled() ) {
			// Early return.
			return;
		}

		// Get button and content elements.
		const button = this.querySelector( 'tp-accordion-handle button' );
		const content: TPAccordionContentElement | null = this.querySelector( 'tp-accordion-content' );

		// Update button aria-expanded.
		if ( button ) {
			button.setAttribute( 'aria-expanded', isOpen ? 'true' : 'false' );
		}

		// Bail if no content.
		if ( ! content ) {
			// Early return.
			return;
		}

		// Set or remove hidden attribute.
		if ( isOpen ) {
			content.removeAttribute( 'hidden' );
		} else {
			content.setAttribute( 'hidden', 'until-found' );
		}
	}

	/**
	 * Get observed attributes.
	 *
	 * @return {Array} List of observed attributes.
	 */
	static get observedAttributes(): string[] {
		// Attributes observed in the TPAccordionItemElement web-component.
		return [ 'open' ];
	}

	/**
	 * Attributes callback.
	 *
	 * Fired on attribute change.
	 *
	 * @param {string} name     Attribute Name.
	 * @param {string} oldValue Old Value.
	 * @param {string} newValue New Value.
	 */
	attributeChangedCallback( name: string, oldValue: string, newValue: string ): void {
		// To check if observed attributes are changed.

		// Early return if no change in attributes.
		if ( oldValue === newValue || 'open' !== name ) {
			// Early return.
			return;
		}

		// Conditionally open or close based on changed value.
		if ( 'yes' === newValue ) {
			this.open();
		} else {
			this.close();
		}

		// Removing default value.
		this.removeAttribute( 'open-by-default' );
	}

	/**
	 * Open accordion item.
	 */
	open(): void {
		// Initializing variables.
		const content: TPAccordionContentElement | null = this.querySelector( 'tp-accordion-content' );

		// Open the accordion.
		if ( content ) {
			this.dispatchEvent( new CustomEvent( 'before-open', { bubbles: true } ) );
			this.updateAriaState( true );
			slideElementDown( content, 600 );
			this.dispatchEvent( new CustomEvent( 'open', { bubbles: true } ) );
		}
	}

	/**
	 * Close accordion item.
	 */
	close(): void {
		// Initializing variables.
		const content: TPAccordionContentElement | null = this.querySelector( 'tp-accordion-content' );

		// Close the accordion.
		if ( content ) {
			this.dispatchEvent( new CustomEvent( 'before-close', { bubbles: true } ) );
			slideElementUp( content, 600, () => {
				// Update state.
				this.updateAriaState( false );
				this.dispatchEvent( new CustomEvent( 'close', { bubbles: true } ) );
			} );
		}
	}
}
