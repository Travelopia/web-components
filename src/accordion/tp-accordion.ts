/**
 * Internal dependencies.
 */
import { TPAccordionItemElement } from './tp-accordion-item';

/**
 * TP Accordion.
 */
export class TPAccordionElement extends HTMLElement {
	/**
	 * Get observed attributes.
	 *
	 * @return {Array} List of observed attributes.
	 */
	static get observedAttributes(): string[] {
		return [ 'collapse-all', 'expand-all' ];
	}

	/**
	 * Attribute changed callback.
	 *
	 * @param {string} name     Attribute name.
	 * @param {string} oldValue Old value.
	 * @param {string} newValue New value.
	 */
	attributeChangedCallback( name: string = '', oldValue: string = '', newValue: string = '' ): void {
		if ( oldValue === newValue ) {
			return;
		}

		this.update();

		if ( 'yes' === newValue && ( 'collapse-all' === name || 'expand-all' === name ) ) {
			this.dispatchEvent( new CustomEvent( name, { bubbles: true } ) );
		}
	}

	/**
	 * Update.
	 */
	update(): void {
		// Get accordion items.
		const accordionItems: NodeListOf<TPAccordionItemElement> = this.querySelectorAll( 'tp-accordion-item' );
		if ( ! accordionItems ) {
			return;
		}

		// Determine action.
		let action: string = '';
		if ( 'yes' === this.getAttribute( 'expand-all' ) ) {
			action = 'expand-all';
		} else if ( 'yes' === this.getAttribute( 'collapse-all' ) ) {
			action = 'collapse-all';
		}

		// Check if we have an action.
		if ( '' === action ) {
			return;
		}

		// Expand or collapse accordion items.
		accordionItems.forEach( ( accordionItem: TPAccordionItemElement ): void => {
			if ( 'expand-all' === action ) {
				accordionItem.setAttribute( 'open', 'yes' );
			} else if ( 'collapse-all' === action ) {
				accordionItem.removeAttribute( 'open' );
			}
		} );
	}
}
