/**
 * Internal Dependency.
 */
import { TPAccordionElement } from './tp-accordion';

/**
 * TPAccordionExpandAllElement.
 */
export class TPAccordionExpandAllElement extends HTMLElement {
	/**
	 * Connected callback.
	 */
	connectedCallback() {
		this.querySelector( 'button' )?.addEventListener( 'click', () => this.expandAll() );
	}

	/**
	 * Expand all.
	 */
	expandAll() {
		const accordions: TPAccordionElement | null = this.closest( 'tp-accordion' );

		if ( ! accordions ) {
			return;
		}

		accordions.setAttribute( 'expand-all', 'yes' );
		accordions.setAttribute( 'collapse-all', 'no' );
	}
}
