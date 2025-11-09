/**
 * Internal dependencies.
 */
import { TPMultiSelectElement } from './tp-multi-select';
import { TPMultiSelectOptionElement } from './tp-multi-select-option';

/**
 * TP Multi Select Select All.
 */
export class TPMultiSelectSelectAllElement extends HTMLElement {
	/**
	 * Constructor.
	 */
	constructor() {
		// Initialize parent.
		super();

		// Add event listeners.
		this.closest( 'tp-multi-select' )?.addEventListener( 'change', this.handleValueChanged.bind( this ) );
		this.addEventListener( 'click', this.toggleSelectAll.bind( this ) );
	}

	/**
	 * Handle value changed.
	 */
	handleValueChanged(): void {
		// Get multi select and options.
		const multiSelect: TPMultiSelectElement | null = this.closest( 'tp-multi-select' );
		const options: NodeListOf<TPMultiSelectOptionElement> | null | undefined = multiSelect?.querySelectorAll( 'tp-multi-select-option' );

		// Check if multi select and options exists.
		if ( ! multiSelect || ! options ) {
			// Bail early.
			return;
		}

		// Check if all options are selected.
		if ( Array.from( options ).filter( ( optionNode ) => optionNode.getAttribute( 'disabled' ) !== 'yes' ).length === multiSelect.value.length ) {
			this.setAttribute( 'selected', 'yes' );
			this.textContent = this.getAttribute( 'unselect-text' ) ?? '';
		} else {
			this.removeAttribute( 'selected' );
			this.textContent = this.getAttribute( 'select-text' ) ?? '';
		}
	}

	/**
	 * Toggle select all.
	 */
	toggleSelectAll(): void {
		// Get multi select.
		const multiSelect: TPMultiSelectElement | null = this.closest( 'tp-multi-select' );

		// Check if multi select exists.
		if ( ! multiSelect ) {
			// Bail early.
			return;
		}

		// Check if select all is yes. Apply selectAll and unselectAll methods accordingly.
		if ( 'yes' !== this.getAttribute( 'selected' ) ) {
			multiSelect.selectAll();
			multiSelect.dispatchEvent( new CustomEvent( 'select-all', { bubbles: true } ) );
		} else {
			multiSelect.unSelectAll();
			multiSelect.dispatchEvent( new CustomEvent( 'unselect-all', { bubbles: true } ) );
		}

		// Dispatch change event.
		multiSelect.dispatchEvent( new CustomEvent( 'change', { bubbles: true } ) );
	}
}
