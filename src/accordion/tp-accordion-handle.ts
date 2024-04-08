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
		super();
		this.querySelector( 'button' )?.addEventListener( 'click', this.toggle.bind( this ) );
	}

	/**
	 * Toggle accordion.
	 */
	toggle(): void {
		const accordionItem: TPAccordionItemElement | null = this.closest( 'tp-accordion-item' );
		if ( ! accordionItem ) {
			return;
		}

		if ( 'yes' !== accordionItem.getAttribute( 'open' ) ) {
			accordionItem.setAttribute( 'open', 'yes' );
		} else {
			accordionItem.removeAttribute( 'open' );
		}
	}
}
