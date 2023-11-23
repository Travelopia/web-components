/**
 * TPAccordionCollapseAllElement.
 */
import { TPAccordionElement } from './tp-accordion';

/**
 * Class TPAccordionCollapseAllElement.
 */
export class TPAccordionCollapseAllElement extends HTMLElement {
	/**
	 * Connected callback.
	 */
	connectedCallback() {
		this.querySelector( 'button' )?.addEventListener( 'click', () => this.collapseAll() );
	}

	/**
	 * Collapse All.
	 */
	collapseAll() {
		// Get accordion element.
		const accordion: TPAccordionElement | null = this.closest( 'tp-accordion' );

		// If accordion not present, return.
		if ( ! accordion ) {
			// Return.
			return;
		}

		// Set attributes for expand-all and collapse-all.
		accordion.setAttribute( 'expand-all', 'no' );
		accordion.setAttribute( 'collapse-all', 'yes' );
	}
}
