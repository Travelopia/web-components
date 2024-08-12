/**
 * Internal dependencies.
 */
import { TPMultiSelectElement } from './tp-multi-select';
import { TPMultiSelectOptionElement } from './tp-multi-select-option';
import { TPMultiSelectPillElement } from './tp-multi-select-pill';

/**
 * TP Multi Select Search.
 */
export class TPMultiSelectSearchElement extends HTMLElement {
	/**
	 * Constructor.
	 */
	constructor() {
		// Initialize parent.
		super();

		// get input.
		const input: HTMLInputElement | null = this.querySelector( 'input' );

		// Check if input exists.
		if ( ! input ) {
			// No, its not. Exit.
			return;
		}

		// Add event listeners.
		input.addEventListener( 'keydown', this.handleKeyboardInputs.bind( this ) );
		input.addEventListener( 'keyup', this.handleSearchChange.bind( this ) );
		input.addEventListener( 'input', this.handleSearchChange.bind( this ) );
		this.addEventListener( 'click', this.handleClick.bind( this ) );
		this.closest( 'tp-multi-select' )?.addEventListener( 'open', this.focus.bind( this ) );
	}

	/**
	 * Handle keyboard inputs.
	 *
	 * @param {Event} e Keyboard event.
	 */
	handleKeyboardInputs( e: KeyboardEvent ): void {
		// Get multi select and search field.
		const multiSelect: TPMultiSelectElement | null = this.closest( 'tp-multi-select' );
		const search: HTMLInputElement | null = this.querySelector( 'input' );

		// Check if multi select and search field exists.
		if ( ! multiSelect || ! search ) {
			// Bail early.
			return;
		}

		// Handle keyboard inputs.
		switch ( e.key ) {
			case 'Enter':
				e.preventDefault(); // Prevent inadvertent form submits.
				break;
			case 'ArrowDown':
				multiSelect.setAttribute( 'open', 'yes' );
				break;
			case 'Backspace': // Remove last pill if search is empty.
				if ( 0 === search.value.length ) {
					const pill: TPMultiSelectPillElement | null = multiSelect.querySelector( 'tp-multi-select-pill:last-of-type' );

					// Check if pill exists, remove it.
					if ( pill ) {
						pill.removePill();
					}
				}
				break;
		}
	}

	/**
	 * Handle search field value changed.
	 */
	protected handleSearchChange(): void {
		// Get search field and options.
		const multiSelect: TPMultiSelectElement | null = this.closest( 'tp-multi-select' );
		const search: HTMLInputElement | null = this.querySelector( 'input' );
		const options: NodeListOf<TPMultiSelectOptionElement> | undefined = this.closest( 'tp-multi-select' )?.querySelectorAll( 'tp-multi-select-option' );

		// Check if multi select, search, and options field exists.
		if ( ! multiSelect || ! search || ! options ) {
			// Bail early.
			return;
		}

		// Initialize matched option count.
		let matchedOptionCount = 0;
		options.forEach( ( option: TPMultiSelectOptionElement ): void => {
			// Hide and show options based on search.
			if ( option.getAttribute( 'label' )?.toLowerCase().match( new RegExp( `.*${ search.value.toLowerCase().replace( /\s/g, '.*' ) }.*` ) ) ) {
				option.removeAttribute( 'hidden' );
				matchedOptionCount++;
			} else {
				option.setAttribute( 'hidden', 'yes' );
			}
		} );

		// Resize input width.
		if ( '' === search.value ) {
			search.removeAttribute( 'style' );
		} else {
			search.style.width = `${ search.value.length + 2 }ch`;
			multiSelect.setAttribute( 'open', 'yes' );
		}

		// Show matched option count.
		multiSelect.setAttribute( 'visible-options', matchedOptionCount.toString() );
	}

	/**
	 * Handle click.
	 *
	 * @param {Event} e Click event.
	 */
	protected handleClick( e: Event ): void {
		// First, prevent propagation to avoid document.click set on `tp-multi-select`.
		e.preventDefault();
		e.stopPropagation();

		// Now send the event so other stuff can work as per normal, and another event for good measure.
		this.dispatchEvent( new CustomEvent( 'multi-select-opened' ) );
		document.dispatchEvent( new Event( 'click' ) );

		// Open multi select.
		this.closest( 'tp-multi-select' )?.setAttribute( 'open', 'yes' );
	}

	/**
	 * Clear the search field.
	 */
	clear(): void {
		// Clear search field.
		const search: HTMLInputElement | null = this.querySelector( 'input' );

		// Check if search field exists.
		if ( search ) {
			// Set value to empty string and dispatch change event.
			search.value = '';
			search.dispatchEvent( new Event( 'change' ) );
		}
	}

	/**
	 * Set focus on the search field.
	 */
	focus(): void {
		// When it's focused, use search change to ensure the results are refreshed.
		this.handleSearchChange();

		// Focus on input.
		this.querySelector( 'input' )?.focus();
	}
}
