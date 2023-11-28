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
		if ( oldValue !== newValue ) {
			this.update();
		}
	}

	/**
	 * Update this component.
	 */
	update(): void {
		const format: string = this.getAttribute( 'format' ) ?? '$total Selected';
		let html: string = format.replace( '$total', this.getAttribute( 'total' ) ?? '' );

		if ( format.includes( '$value' ) ) {
			const multiSelect: TPMultiSelectElement | null = this.closest( 'tp-multi-select' );
			if ( multiSelect ) {
				const value: string[] = multiSelect.value ?? [];
				let replace: string = '';

				if ( value.length > 0 ) {
					const option: TPMultiSelectOptionElement | null = multiSelect.querySelector( `tp-multi-select-option[value="${ value[ 0 ] }"]` );
					if ( option ) {
						replace = option.getAttribute( 'label' ) ?? '';
					}
				}

				html = html.replace( '$value', replace );
			}
		}

		this.innerHTML = html;
	}
}
