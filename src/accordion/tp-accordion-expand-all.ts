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
		// Event.
		this.querySelector( 'button' )?.addEventListener( 'click', () => this.expandAll() );
	}

	/**
	 * Expand all.
	 */
	expandAll() {
		// Get accordion.
		const accordion: TPAccordionElement | null = this.closest( 'tp-accordion' );

		// Early return, if accordion not present.
		if ( ! accordion ) {
			// Return.
			return;
		}

		// Set attributes for expand-all and collapse-all.
		accordion.setAttribute( 'expand-all', 'yes' );
		accordion.setAttribute( 'collapse-all', 'no' );
	}
}
