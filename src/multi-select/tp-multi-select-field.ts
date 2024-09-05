/**
 * Internal dependencies.
 */
import { TPMultiSelectElement } from './tp-multi-select';

/**
 * TP Multi Select Field.
 */
export class TPMultiSelectFieldElement extends HTMLElement {
	/**
	 * Constructor.
	 */
	constructor() {
		// Initialize parent.
		super();

		// Add event listener.
		this.addEventListener( 'click', this.toggleOpen.bind( this ) );
	}

	/**
	 * Toggle opening this component.
	 */
	toggleOpen(): void {
		// Get multi-select.
		const multiSelect: TPMultiSelectElement | null = this.closest( 'tp-multi-select' );

		// Bail early if we don't have a multi-select.
		if ( ! multiSelect ) {
			// Bail early.
			return;
		}

		// Toggle open.
		if ( 'yes' === multiSelect.getAttribute( 'open' ) ) {
			multiSelect.removeAttribute( 'open' );
		} else {
			multiSelect.setAttribute( 'open', 'yes' );
		}
	}
}
