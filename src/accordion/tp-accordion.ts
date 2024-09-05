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
		// Attributes observed in the TPAccordionItemElement web-component.
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
		// To check if observed attributes are changed.

		//Early return if no change in attributes.
		if ( oldValue === newValue ) {
			// Early return.
			return;
		}

		// Update initially according to the value present in expand-all or collapse all.
		this.update();

		// If attribute value is changed then open and close according to the name of event.
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

		//Early return if accordion items are not present.
		if ( ! accordionItems ) {
			// Early return.
			return;
		}

		// Initialize action variable.
		let action: string = '';

		// Determine action.
		if ( 'yes' === this.getAttribute( 'expand-all' ) ) {
			action = 'expand-all';
		} else if ( 'yes' === this.getAttribute( 'collapse-all' ) ) {
			action = 'collapse-all';
		}

		// Check if we have an action.
		if ( '' === action ) {
			// Return if action is not present.
			return;
		}

		// Expand or collapse accordion items.
		accordionItems.forEach( ( accordionItem: TPAccordionItemElement ): void => {
			// Conditionally expand or collapse each item.
			if ( 'expand-all' === action ) {
				accordionItem.setAttribute( 'open', 'yes' );
			} else if ( 'collapse-all' === action ) {
				accordionItem.removeAttribute( 'open' );
			}
		} );
	}
}
