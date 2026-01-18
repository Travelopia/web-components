/**
 * Internal dependencies.
 */
import { TPMultiSelectElement } from './tp-multi-select';

/**
 * Counter for generating unique IDs.
 */
let optionIdCounter = 0;

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
	 * Get observed attributes.
	 *
	 * @return {Array} List of observed attributes.
	 */
	static get observedAttributes(): string[] {
		return [ 'selected' ];
	}

	/**
	 * Connected callback.
	 */
	connectedCallback(): void {
		// Setup ARIA attributes.
		this.setupAriaAttributes();
	}

	/**
	 * Attribute changed callback.
	 *
	 * @param {string} name     Attribute name.
	 * @param {string} oldValue Old value.
	 * @param {string} newValue New value.
	 */
	attributeChangedCallback( name: string = '', oldValue: string = '', newValue: string = '' ): void {
		// If no changes.
		if ( oldValue === newValue ) {
			return;
		}

		// Update ARIA state when selected changes.
		if ( 'selected' === name ) {
			this.updateAriaState();
		}
	}

	/**
	 * Setup ARIA attributes for the option.
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
			this.id = `tp-multi-select-option-${ ++optionIdCounter }`;
		}

		// Set option role.
		this.setAttribute( 'role', 'option' );

		// Set tabindex only if not already present (needed for relatedTarget to work on focusout).
		if ( ! this.hasAttribute( 'tabindex' ) ) {
			this.setAttribute( 'tabindex', '-1' );
		}

		// Set initial ARIA state.
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
