/**
 * TpAccordionsAccordionElement.
 */
import { TPAccordionContentElement } from './tp-accordion-content';
import { slideElementDown, slideElementUp } from '../global/utility';

/**
 * Class TPAccordionItemElement.
 */
export class TPAccordionItemElement extends HTMLElement {
	/**
	 * Observe Attributes.
	 *
	 * @return {string[]} Attributes to be observed.
	 */
	static get observedAttributes() {
		// Return list of observed attributes.
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
	attributeChangedCallback( name: string, oldValue: string, newValue: string ) {
		// Check if attribute value has changed.
		if ( oldValue === newValue ) {
			// Return early if attribute is modified with same value.
			return;
		}

		// Check if this is the active attribute.
		if ( 'open' === name ) {
			const content: TPAccordionContentElement | null = this.querySelector( 'tp-accordion-content' );

			// Return early if content not found.
			if ( ! content ) {
				// Return early.
				return;
			}

			// Show or hide content based on active argument.
			if ( ! this.hasAttribute( 'open' ) ) {
				slideElementUp( content, 600 );
			} else {
				slideElementDown( content, 600 );
			}
		}
	}
}
