import { TPAccordionsAccordionElement } from './tp-accordions-accordion';

export class TPAccordionsElement extends HTMLElement {
	/**
	 * Get observed attributes.
	 *
	 * @return {Array} List of observed attributes.
	 */
	static get observedAttributes(): string[] {
		return [ 'collapse-all', 'expand-all' ];
	}

	/**
	 * Attribute changed callback.
	 *
	 * @param {string} name     Attribute name.
	 * @param {string} oldValue Old value.
	 * @param {string} newValue New value.
	 */
	attributeChangedCallback( name: string = '', oldValue: string = '', newValue: string = '' ): void {
		if ( oldValue === newValue ) {
			return;
		}

		this.update();

		if ( 'collapse-all' === name ) {
			this.dispatchEvent( new CustomEvent( 'collapse', { bubbles: true } ) );
		}

		if ( 'expand-all' === name ) {
			this.dispatchEvent( new CustomEvent( 'expand-all', { bubbles: true } ) );
		}
	}

	update() {
		// Get current tab.
		// const currentAccordionItemIndex: string = this.getAttribute( 'current-open-accordion' ) ?? '';
		const accordionElements: NodeListOf<TPAccordionsAccordionElement> = this.querySelectorAll( 'tp-accordions-accordion' );

		if ( ! accordionElements ) {
			return;
		}

		accordionElements.forEach( ( accordionElement: TPAccordionsAccordionElement ): void => {
			if ( ! accordionElement ) {
				return;
			}

			if ( 'yes' === this.getAttribute( 'expand-all' ) ) {
				accordionElement.setAttribute( 'open', 'yes' );
			}
			if ( 'yes' === this.getAttribute( 'collapse-all' ) ) {
				accordionElement.removeAttribute( 'open' );
			}
		} )
	}
}
