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
		super();
		this.addEventListener( 'click', this.toggleOpen.bind( this ) );
	}

	/**
	 * Toggle opening this component.
	 */
	toggleOpen(): void {
		const multiSelect: TPMultiSelectElement | null = this.closest( 'tp-multi-select' );
		if ( ! multiSelect ) {
			return;
		}

		if ( 'yes' === multiSelect.getAttribute( 'open' ) ) {
			multiSelect.removeAttribute( 'open' );
		} else {
			multiSelect.setAttribute( 'open', 'yes' );
		}
	}
}
