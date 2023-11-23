import { TPAccordionElement } from './tp-accordion';

/**
 * TPAccordionHandleElement.
 */
export class TPAccordionHandleElement extends HTMLElement {
	/**
	 * Connected callback.
	 */
	connectedCallback() {
		// Add event.
		this.querySelector( 'button' )?.addEventListener( 'click', () => this.toggle() );
	}

	/**
	 * Toggle accordion state.
	 */
	toggle() {
		// Get accordion.
		const accordion: TPAccordionElement | null = this.closest( 'tp-accordion' );

		// Set attributes to accordion.
		if ( accordion ) {
			accordion.setAttribute( 'expand-all', 'no' );
			accordion.setAttribute( 'collapse-all', 'no' );
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
