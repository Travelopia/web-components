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
		// Initialize parent.
		super();
		this.querySelector( 'button' )?.addEventListener( 'click', this.expandAll.bind( this ) );
	}

	/**
	 * Expand all.
	 */
	expandAll() {
		// Get accordion.
		const accordion: TPAccordionElement | null = this.closest( 'tp-accordion' );

		// Terminates if accordion is not present.
		if ( ! accordion ) {
			// Early return.
			return;
		}

		// Set attributes for expand-all and collapse-all.
		accordion.setAttribute( 'expand-all', 'yes' );
		accordion.removeAttribute( 'collapse-all' );
	}
}
