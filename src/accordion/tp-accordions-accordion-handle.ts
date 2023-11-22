import { TPAccordionsElement } from './tp-accordions';

/**
 * TPAccordionsAccordionHandleElement.
 */
export class TPAccordionsAccordionHandleElement extends HTMLElement {
	private accordions: TPAccordionsElement | null;
	constructor() {
		super();

		this.accordions = this.closest( 'tp-accordions' );
	}
	connectedCallback() {
		this.addEventListener( 'click',  () => this.toggle() );
	}

	/**
	 * Toggle accordion state.
	 */
	toggle() {

		if ( this.accordions ) {
			this.accordions.setAttribute( 'expand-all', 'no' );
			this.accordions.setAttribute( 'collapse-all', 'no' );
		}

		// Toggle accordion item states.
		this.parentElement?.toggleAttribute( 'open' );
	}

	/**
	 * Open accordion.
	 */
	open() {
		// Set the attributes of the accordion to expand it.
		this.setAttribute( 'open', 'yes' );
	}

	/**
	 * Close accordion.
	 */
	close() {
		// Set the attributes of the accordion to collapse it.
		this.removeAttribute( 'open' );
	}
}
