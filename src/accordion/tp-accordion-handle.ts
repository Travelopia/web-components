/**
 * Internal dependencies.
 */
import { TPAccordionItemElement } from './tp-accordion-item';

/**
 * TP Accordion Handle.
 */
export class TPAccordionHandleElement extends HTMLElement {
	/**
	 * Constructor.
	 */
	constructor() {
		// Initialize parent.
		super();
		this.querySelector( 'button' )?.addEventListener( 'click', this.toggle.bind( this ) );
	}

	/**
	 * Toggle accordion.
	 */
	toggle(): void {
		// Variables.
		const accordionItem: TPAccordionItemElement | null = this.closest( 'tp-accordion-item' );

		// Terminates if accordion item is not present.
		if ( ! accordionItem ) {
			//Early return.
			return;
		}

		// If accordion item is open.
		if ( 'yes' !== accordionItem.getAttribute( 'open' ) ) {
			accordionItem.setAttribute( 'open', 'yes' );
		} else {
			accordionItem.removeAttribute( 'open' );
		}
	}
}
