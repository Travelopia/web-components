import { TPAccordionsElement } from './tp-accordions';

/**
 * TPAccordionsExpandAllElement.
 */
export class TPAccordionsExpandAllElement extends HTMLElement {
	connectedCallback() {
		this.addEventListener( 'click', () => this.expandAllAccordion() )
	}

	expandAllAccordion() {
		const accordions: TPAccordionsElement | null = this.closest( 'tp-accordions' );

		if ( ! accordions ) {
			return;
		}

		accordions.setAttribute( 'expand-all', 'yes' );
		accordions.setAttribute( 'collapse-all', 'no' );
	}
}
