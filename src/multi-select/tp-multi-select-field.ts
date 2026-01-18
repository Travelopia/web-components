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
		if ( ! multiSelect ) {
			return;
		}

		// Open on Enter, Space, or ArrowDown (only if dropdown is closed).
		if ( 'Enter' === e.key || ' ' === e.key || 'ArrowDown' === e.key ) {
			if ( 'yes' !== multiSelect.getAttribute( 'open' ) ) {
				e.preventDefault();

				// Stop propagation to prevent the multi-select's keyboard handler from
				// processing the same ArrowDown event and advancing to the second option.
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
			return;
		}

		// If search input exists, it will be the combobox - don't set attributes on field.
		const searchInput: HTMLInputElement | null = multiSelect.querySelector( 'tp-multi-select-search input' );
		if ( searchInput ) {
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
