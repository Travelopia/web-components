import { TPAccordionElement } from './tp-accordion';

/**
 * TPAccordionHandleElement.
 */
export class TPAccordionHandleElement extends HTMLElement {
	/**
	 * Connected callback.
	 */
	connectedCallback() {
		this.querySelector( 'button' )?.addEventListener( 'click', () => this.toggle() );
	}

	/**
	 * Toggle accordion state.
	 */
	toggle() {
		const accordions: TPAccordionElement | null = this.closest( 'tp-accordion' );
		if ( accordions ) {
			accordions.setAttribute( 'expand-all', 'no' );
			accordions.setAttribute( 'collapse-all', 'no' );
		}

		// Toggle accordion item states.
		this.closest( 'tp-accordion-item' )?.toggleAttribute( 'open' );
	}

	/**
	 * Open accordion.
	 */
	open() {
		// Set the attributes of the accordion to expand it.
		this.closest( 'tp-accordion-item' )?.setAttribute( 'open', 'yes' );
	}

	/**
	 * Close accordion.
	 */
	close() {
		// Set the attributes of the accordion to collapse it.
		this.closest( 'tp-accordion-item' )?.removeAttribute( 'open' );
	}
}
