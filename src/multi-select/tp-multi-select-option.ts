/**
 * Internal dependencies.
 */
import { TPMultiSelectElement } from './tp-multi-select';

/**
 * TP Multi Select Option.
 */
export class TPMultiSelectOptionElement extends HTMLElement {
	/**
	 * Connected callback.
	 */
	connectedCallback(): void {
		this.addEventListener( 'click', this.toggle.bind( this ) );
	}

	/**
	 * Select / un-select this option.
	 */
	toggle(): void {
		const multiSelect: TPMultiSelectElement | null = this.closest( 'tp-multi-select' );
		const value: string = this.getAttribute( 'value' ) ?? '';

		if ( 'yes' !== this.getAttribute( 'selected' ) ) {
			multiSelect?.select( value );
		} else {
			multiSelect?.unSelect( value );
		}
	}
}
