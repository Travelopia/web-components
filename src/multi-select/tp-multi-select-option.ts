/**
 * Internal dependencies.
 */
import { TPMultiSelectElement } from './tp-multi-select';

/**
 * TP Multi Select Option.
 */
export class TPMultiSelectOptionElement extends HTMLElement {
	/**
	 * Constructor.
	 */
	constructor() {
		// Initialize parent.
		super();

		// Add event listener to toggle the selected state.
		this.addEventListener( 'click', this.toggle.bind( this ) );
	}

	/**
	 * Select / un-select this option.
	 *
	 * @param {Event} e Click event.
	 */
	toggle( e: Event | null ): void {
		// Prevent default behavior and stop propagation.
		e?.preventDefault();
		e?.stopPropagation();

		// Get multi-select element and value of option.
		const multiSelect: TPMultiSelectElement | null = this.closest( 'tp-multi-select' );
		const value: string = this.getAttribute( 'value' ) ?? '';

		// Toggle selected state. Dispatch custom events accordingly.
		if ( 'yes' !== this.getAttribute( 'selected' ) ) {
			multiSelect?.select( value );
			multiSelect?.dispatchEvent( new CustomEvent( 'select', {
				bubbles: true,
				detail: { value },
			} ) );
		} else {
			multiSelect?.unSelect( value );
			multiSelect?.dispatchEvent( new CustomEvent( 'unselect', {
				bubbles: true,
				detail: { value },
			} ) );
		}

		// Dispatch change event.
		multiSelect?.dispatchEvent( new CustomEvent( 'change', { bubbles: true } ) );
	}
}
