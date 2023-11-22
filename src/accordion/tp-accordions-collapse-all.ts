/**
 * TPAccordionsCollapseAllElement.
 */
import { TPAccordionsElement } from './tp-accordions';

export class TPAccordionsCollapseAllElement extends HTMLElement {
	connectedCallback() {
		this.addEventListener( 'click', () => this.collapseAllAccordion() )
	}

	collapseAllAccordion() {
		const accordions: TPAccordionsElement | null = this.closest( 'tp-accordions' );
		if ( ! accordions ) {
			return;
		}

		accordions.setAttribute( 'expand-all', 'no' );
		accordions.setAttribute( 'collapse-all', 'yes' );
	}
}
