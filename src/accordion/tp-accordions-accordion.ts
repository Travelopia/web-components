/**
 * TpAccordionsAccordionElement.
 */
import { TPAccordionsAccordionContentElement } from './tp-accordions-accordion-content';
import { slideElementDown, slideElementUp } from '../global/utility';

export class TPAccordionsAccordionElement extends HTMLElement {
	private content: TPAccordionsAccordionContentElement | null;

	constructor() {
		super();

		this.content = this.querySelector( 'tp-accordions-accordion-content' );
	}

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
			// Return early if content not found.
			if ( ! this.content ) {
				// Return early.
				return;
			}

			// Show or hide content based on active argument.
			if ( ! this.hasAttribute( 'open' ) ) {
				slideElementUp( this.content, 600 );
			} else {
				slideElementDown( this.content, 600 );
			}
		}
	}
}
