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
		super();

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
		if ( oldValue === newValue || 'open' !== name ) {
			return;
		}

		if ( 'yes' === newValue ) {
			this.open();
		} else {
			this.close();
		}

		this.removeAttribute( 'open-by-default' );
	}

	/**
	 * Open accordion item.
	 */
	open(): void {
		const content: TPAccordionContentElement | null = this.querySelector( 'tp-accordion-content' );
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
		const content: TPAccordionContentElement | null = this.querySelector( 'tp-accordion-content' );
		if ( content ) {
			this.dispatchEvent( new CustomEvent( 'before-close', { bubbles: true } ) );
			slideElementUp( content, 600 );
			this.dispatchEvent( new CustomEvent( 'close', { bubbles: true } ) );
		}
	}
}
