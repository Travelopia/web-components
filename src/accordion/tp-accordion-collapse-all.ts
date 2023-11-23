/**
 * Internal dependencies.
 */
import { TPAccordionElement } from './tp-accordion';

/**
 * TP Accordion Collapse All.
 */
export class TPAccordionCollapseAllElement extends HTMLElement {
	/**
	 * Connected callback.
	 */
	connectedCallback(): void {
		this.querySelector( 'button' )?.addEventListener( 'click', () => this.collapseAll() );
	}

	/**
	 * Collapse All.
	 */
	collapseAll(): void {
		// Get accordion element.
		const accordion: TPAccordionElement | null = this.closest( 'tp-accordion' );
		if ( ! accordion ) {
			return;
		}

		// Set attributes for expand-all and collapse-all.
		accordion.removeAttribute( 'expand-all' );
		accordion.setAttribute( 'collapse-all', 'yes' );
	}
}
