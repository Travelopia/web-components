/**
 * Internal dependencies.
 */
import { TPAccordionElement } from './tp-accordion';

/**
 * TP Accordion Collapse All.
 */
export class TPAccordionCollapseAllElement extends HTMLElement {
	/**
	 * Constructor.
	 */
	constructor() {
		// Initialize parent.
		super();
		this.querySelector( 'button' )?.addEventListener( 'click', () => this.collapseAll() );
	}

	/**
	 * Collapse All.
	 */
	collapseAll(): void {
		// Get accordion element.
		const accordion: TPAccordionElement | null = this.closest( 'tp-accordion' );

		// Terminates the function if accordion is not available.
		if ( ! accordion ) {
			// Early return.
			return;
		}

		// Set attributes for expand-all and collapse-all.
		accordion.removeAttribute( 'expand-all' );
		accordion.setAttribute( 'collapse-all', 'yes' );
	}
}
