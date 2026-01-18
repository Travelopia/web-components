/**
 * Internal dependencies.
 */
import { TPMultiSelectElement } from './tp-multi-select';
import { TPMultiSelectOptionElement } from './tp-multi-select-option';

/**
 * Counter for generating unique IDs.
 */
let selectAllIdCounter = 0;

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
	 * Connected callback.
	 */
	connectedCallback(): void {
		// Setup ARIA attributes.
		this.setupAriaAttributes();
	}

	/**
	 * Setup ARIA attributes for the select all option.
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
			this.id = `tp-multi-select-all-${ ++selectAllIdCounter }`;
		}

		// Set option role.
		this.setAttribute( 'role', 'option' );

		// Set initial aria-selected state.
		this.updateAriaState();
	}

	/**
	 * Update ARIA state based on selected attribute.
	 */
	updateAriaState(): void {
		// Get multi-select.
		const multiSelect: TPMultiSelectElement | null = this.closest( 'tp-multi-select' );

		// Check if ARIA is enabled.
		if ( ! multiSelect?.isAriaEnabled() ) {
			return;
		}

		// Update aria-selected.
		const isSelected = 'yes' === this.getAttribute( 'selected' );
		this.setAttribute( 'aria-selected', isSelected ? 'true' : 'false' );
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
			this.innerHTML = this.getAttribute( 'unselect-text' ) ?? '';
		} else {
			this.removeAttribute( 'selected' );
			this.innerHTML = this.getAttribute( 'select-text' ) ?? '';
		}

		// Update ARIA state.
		this.updateAriaState();
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
