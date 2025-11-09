/**
 * Internal dependencies.
 */
import { TPMultiSelectElement } from './tp-multi-select';
import { TPMultiSelectOptionElement } from './tp-multi-select-option';

/**
 * TP Multi Select Status.
 */
export class TPMultiSelectStatusElement extends HTMLElement {
	/**
	 * Get observed attributes.
	 *
	 * @return {Array} List of observed attributes.
	 */
	static get observedAttributes(): string[] {
		// Attributes to observe.
		return [ 'total', 'format' ];
	}

	/**
	 * Attribute changed callback.
	 *
	 * @param {string} _name    Attribute name.
	 * @param {string} oldValue Old value.
	 * @param {string} newValue New value.
	 */
	attributeChangedCallback( _name: string = '', oldValue: string = '', newValue: string = '' ): void {
		// Update component.
		if ( oldValue !== newValue ) {
			this.update();
		}
	}

	/**
	 * Update this component.
	 */
	update(): void {
		// Get format attribute.
		const format: string = this.getAttribute( 'format' ) ?? '$total Selected';
		let text: string = format.replace( '$total', this.getAttribute( 'total' ) ?? '' );

		// Format string includes $value.
		if ( format.includes( '$value' ) ) {
			// Get multi-select.
			const multiSelect: TPMultiSelectElement | null = this.closest( 'tp-multi-select' );

			// Check if multi-select exists.
			if ( multiSelect ) {
				// Get value if present or create an empty array.
				const value: string[] = multiSelect.value ?? [];
				let replace: string = '';

				// Check if value array is not empty.
				if ( value.length > 0 ) {
					// Get first value.
					const option: TPMultiSelectOptionElement | null = multiSelect.querySelector( `tp-multi-select-option[value="${ value[ 0 ] }"]` );

					// Check if option exists.
					if ( option ) {
						replace = option.getAttribute( 'label' ) ?? '';
					}
				}

				// Replace $value.
				text = text.replace( '$value', replace );
			}
		}

		// Set text content.
		this.textContent = text;
	}
}
