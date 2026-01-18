/**
 * Internal dependencies.
 */
import { TPMultiSelectElement } from './tp-multi-select';

/**
 * Counter for generating unique IDs.
 */
let optionsIdCounter = 0;

/**
 * TP Multi Select Options.
 */
export class TPMultiSelectOptionsElement extends HTMLElement {
	/**
	 * Connected callback.
	 */
	connectedCallback(): void {
		// Setup ARIA attributes.
		this.setupAriaAttributes();
	}

	/**
	 * Setup ARIA attributes for the listbox.
	 */
	setupAriaAttributes(): void {
		// Get multi-select.
		const multiSelect: TPMultiSelectElement | null = this.closest( 'tp-multi-select' );

		// Check if ARIA is enabled.
		if ( ! multiSelect?.isAriaEnabled() ) {
			return;
		}

		// Auto-generate ID if not present.
		if ( ! this.id ) {
			this.id = `tp-multi-select-listbox-${ ++optionsIdCounter }`;
		}

		// Set listbox role.
		this.setAttribute( 'role', 'listbox' );

		// Set aria-multiselectable if multiple selection is enabled.
		if ( 'no' !== multiSelect.getAttribute( 'multiple' ) ) {
			this.setAttribute( 'aria-multiselectable', 'true' );
		}
	}
}
