/**
 * Internal dependencies.
 */
import { TPAccordionElement } from './tp-accordion';

/**
 * TP Accordion Expand All.
 */
export class TPAccordionExpandAllElement extends HTMLElement {
	/**
	 * Constructor.
	 */
	constructor() {
		super();
		this.querySelector( 'button' )?.addEventListener( 'click', this.expandAll.bind( this ) );
	}

	/**
	 * Expand all.
	 */
	expandAll() {
		// Get accordion.
		const accordion: TPAccordionElement | null = this.closest( 'tp-accordion' );
		if ( ! accordion ) {
			return;
		}

		// Set attributes for expand-all and collapse-all.
		accordion.setAttribute( 'expand-all', 'yes' );
		accordion.removeAttribute( 'collapse-all' );
	}
}
