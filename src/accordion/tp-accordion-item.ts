/**
 * Internal dependencies.
 */
import { TPAccordionContentElement } from './tp-accordion-content';
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

		//Early return if no change in attributes.
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
			slideElementUp( content, 600 );
			this.dispatchEvent( new CustomEvent( 'close', { bubbles: true } ) );
		}
	}
}
