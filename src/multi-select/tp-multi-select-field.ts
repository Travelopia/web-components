/**
 * Internal dependencies.
 */
import { TPMultiSelectElement } from './tp-multi-select';
import { TPMultiSelectOptionsElement } from './tp-multi-select-options';

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

		// Add event listeners.
		this.addEventListener( 'click', this.toggleOpen.bind( this ) );
		this.addEventListener( 'keydown', this.handleKeydown.bind( this ) );
	}

	/**
	 * Handle keydown events to open the dropdown.
	 *
	 * @param {KeyboardEvent} e Keyboard event.
	 */
	handleKeydown( e: KeyboardEvent ): void {
		// Get multi-select.
		const multiSelect: TPMultiSelectElement | null = this.closest( 'tp-multi-select' );

		// Bail if no multi-select.
		if ( ! multiSelect ) {
			// Early return.
			return;
		}

		// Open on Enter, Space, or ArrowDown (only if dropdown is closed).
		if ( 'Enter' === e.key || ' ' === e.key || 'ArrowDown' === e.key ) {
			// Check if dropdown is currently closed.
			if ( 'yes' !== multiSelect.getAttribute( 'open' ) ) {
				e.preventDefault();
				e.stopPropagation();
				multiSelect.setAttribute( 'open', 'yes' );
			}
		}
	}

	/**
	 * Connected callback.
	 */
	connectedCallback(): void {
		// Setup ARIA attributes.
		this.setupAriaAttributes();

		// Wire up label click.
		this.setupLabelClick();
	}

	/**
	 * Setup label click to focus this field.
	 * Enables clicking the label to focus the field when aria-labelledby is present.
	 */
	setupLabelClick(): void {
		// Get aria-labelledby attribute.
		const labelledBy: string | null = this.getAttribute( 'aria-labelledby' );

		// Bail if no labelledby attribute.
		if ( ! labelledBy ) {
			// Early return.
			return;
		}

		// Find the label element.
		const label: HTMLElement | null = document.getElementById( labelledBy );

		// Bail if no label found.
		if ( ! label ) {
			// Early return.
			return;
		}

		// Add click listener to focus this field.
		label.addEventListener( 'click', () => {
			// Focus this field.
			this.focus();
		} );
	}

	/**
	 * Setup ARIA attributes for the field element.
	 * Only applies when there is no search input (field acts as combobox).
	 */
	setupAriaAttributes(): void {
		// Get multi-select.
		const multiSelect: TPMultiSelectElement | null = this.closest( 'tp-multi-select' );

		// Check if ARIA is enabled.
		if ( ! multiSelect?.isAriaEnabled() ) {
			// Early return.
			return;
		}

		// If search input exists, it will be the combobox - don't set attributes on field.
		const searchInput: HTMLInputElement | null = multiSelect.querySelector( 'tp-multi-select-search input' );

		// Bail if search input exists.
		if ( searchInput ) {
			// Early return.
			return;
		}

		// Get options container.
		const options: TPMultiSelectOptionsElement | null = multiSelect.querySelector( 'tp-multi-select-options' );

		// Set combobox role and attributes.
		this.setAttribute( 'role', 'combobox' );
		this.setAttribute( 'aria-haspopup', 'listbox' );
		this.setAttribute( 'aria-expanded', 'false' );

		// Set tabindex only if not already present.
		if ( ! this.hasAttribute( 'tabindex' ) ) {
			this.setAttribute( 'tabindex', '0' );
		}

		// Set aria-controls pointing to options ID.
		if ( options ) {
			this.setAttribute( 'aria-controls', options.id );
		}
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
