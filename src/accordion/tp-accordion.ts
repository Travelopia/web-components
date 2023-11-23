/**
 * Internal Dependency.
 */
import { TPAccordionItemElement } from './tp-accordion-item';

/**
 * Class TPAccordionElement.
 */
export class TPAccordionElement extends HTMLElement {
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

	/**
	 * Update.
	 */
	update() {
		// Get accordion elements.
		const accordionElements: NodeListOf<TPAccordionItemElement> = this.querySelectorAll( 'tp-accordion-item' );

		// If accordion elements not present, return.
		if ( ! accordionElements ) {
			return;
		}

		// Loop through accordion elements.
		accordionElements.forEach( ( accordionElement: TPAccordionItemElement ): void => {
			// If accordion element not present, return.
			if ( ! accordionElement ) {
				return;
			}

			// Set the attribute for accordion element.
			if ( 'yes' === this.getAttribute( 'expand-all' ) ) {
				accordionElement.setAttribute( 'open', 'yes' );
			}

			// Remove the attribute for accordion element.
			if ( 'yes' === this.getAttribute( 'collapse-all' ) ) {
				accordionElement.removeAttribute( 'open' );
			}
		} );
	}
}
