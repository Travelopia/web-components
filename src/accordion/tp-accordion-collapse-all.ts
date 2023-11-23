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
	 * Get observed attributes.
	 *
	 * @return {Array} List of observed attributes.
	 */
	static get observedAttributes(): string[] {
		return [ 'collapse-all', 'expand-all' ];
	}

	/**
	 * Collapse All.
	 */
	collapseAll() {
		// Get accordion element.
		const accordion: TPAccordionElement | null = this.closest( 'tp-accordion' );

		// If accordion not present, return.
		if ( ! accordion ) {
			return;
		}

		accordion.setAttribute( 'expand-all', 'no' );
		accordion.setAttribute( 'collapse-all', 'yes' );
	}
}
