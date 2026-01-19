/**
 * Internal dependencies.
 */
import { TPMultiSelectElement } from './tp-multi-select';
import { TPMultiSelectOptionElement } from './tp-multi-select-option';

/**
 * TP Multi Select Search Status.
 */
export class TPMultiSelectSearchStatusElement extends HTMLElement {
	/**
	 * Store the default role from markup.
	 */
	protected defaultRole: string | null = null;

	/**
	 * Store the default aria-live from markup.
	 */
	protected defaultAriaLive: string | null = null;

	/**
	 * Connected callback.
	 */
	connectedCallback(): void {
		// Store the default role and aria-live from markup.
		this.defaultRole = this.getAttribute( 'role' );
		this.defaultAriaLive = this.getAttribute( 'aria-live' );

		// Get multi-select and search input.
		const multiSelect: TPMultiSelectElement | null = this.closest( 'tp-multi-select' );
		const searchInput: HTMLInputElement | null = multiSelect?.querySelector( 'tp-multi-select-search input' ) ?? null;

		// Listen for search input changes.
		if ( searchInput ) {
			searchInput.addEventListener( 'input', this.update.bind( this ) );
		}

		// Initial update.
		this.update();
	}

	/**
	 * Update this component.
	 */
	update(): void {
		// Get multi-select.
		const multiSelect: TPMultiSelectElement | null = this.closest( 'tp-multi-select' );

		// Bail if no multi-select.
		if ( ! multiSelect ) {
			// Early return.
			return;
		}

		// Get visible options count.
		const visibleOptions: NodeListOf<TPMultiSelectOptionElement> = multiSelect.querySelectorAll( 'tp-multi-select-option:not([hidden="yes"])' );
		const count: number = visibleOptions.length;

		// Get format attributes.
		const format: string = this.getAttribute( 'format' ) ?? '$count results';
		const noResultsFormat: string = this.getAttribute( 'no-results-format' ) ?? 'No results found';

		// Get role and aria-live attributes for no-results state.
		const noResultsRole: string | null = this.getAttribute( 'no-results-role' );
		const noResultsAriaLive: string | null = this.getAttribute( 'no-results-aria-live' );

		// Update text content, role, and aria-live based on count.
		if ( 0 === count ) {
			this.textContent = noResultsFormat;

			// Switch to no-results role if specified.
			if ( noResultsRole ) {
				this.setAttribute( 'role', noResultsRole );
			}

			// Switch to no-results aria-live if specified.
			if ( noResultsAriaLive ) {
				this.setAttribute( 'aria-live', noResultsAriaLive );
			}
		} else {
			this.textContent = format.replace( '$count', count.toString() );

			// Restore default role.
			if ( this.defaultRole ) {
				this.setAttribute( 'role', this.defaultRole );
			} else {
				this.removeAttribute( 'role' );
			}

			// Restore default aria-live.
			if ( this.defaultAriaLive ) {
				this.setAttribute( 'aria-live', this.defaultAriaLive );
			} else {
				this.removeAttribute( 'aria-live' );
			}
		}
	}
}
