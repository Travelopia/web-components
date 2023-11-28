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
	 * Connected callback.
	 */
	connectedCallback(): void {
		const input: HTMLInputElement | null = this.querySelector( 'input' );
		if ( ! input ) {
			return;
		}

		input.addEventListener( 'keydown', this.handleKeyboardInputs.bind( this ) );
		input.addEventListener( 'keyup', this.handleSearchChange.bind( this ) );
		input.addEventListener( 'change', this.handleSearchChange.bind( this ) );
		this.addEventListener( 'click', this.handleClick.bind( this ) );
		this.closest( 'tp-multi-select' )?.addEventListener( 'open', this.focus.bind( this ) );
	}

	/**
	 * Handle keyboard inputs.
	 *
	 * @param {Event} e Keyboard event.
	 */
	handleKeyboardInputs( e: KeyboardEvent ): void {
		const multiSelect: TPMultiSelectElement | null = this.closest( 'tp-multi-select' );
		const search: HTMLInputElement | null = this.querySelector( 'input' );
		if ( ! multiSelect || ! search ) {
			return;
		}

		switch ( e.key ) {
			case 'ArrowDown':
				multiSelect.setAttribute( 'open', 'yes' );
				break;
			case 'Backspace':
				if ( 0 === search.value.length ) {
					const pill: TPMultiSelectPillElement | null = multiSelect.querySelector( 'tp-multi-select-pill:last-of-type' );
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
		if ( ! multiSelect || ! search || ! options ) {
			return;
		}

		// Hide and show options based on search.
		options.forEach( ( option: TPMultiSelectOptionElement ): void => {
			if ( option.getAttribute( 'value' )?.match( new RegExp( `.*${ search.value }.*` ) ) ) {
				option.removeAttribute( 'hidden' );
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
	}

	/**
	 * Handle click.
	 *
	 * @param {Event} e Click event.
	 */
	protected handleClick( e: Event ): void {
		e.preventDefault();
		e.stopPropagation();
		this.closest( 'tp-multi-select' )?.setAttribute( 'open', 'yes' );
	}

	/**
	 * Clear the search field.
	 */
	clear(): void {
		const search: HTMLInputElement | null = this.querySelector( 'input' );
		if ( search ) {
			search.value = '';
			search.dispatchEvent( new Event( 'change' ) );

			if ( 'yes' === this.getAttribute( 'close-on-select' ) ) {
				this.closest( 'tp-multi-select' )?.removeAttribute( 'open' );
			}
		}
	}

	/**
	 * Set focus on the search field.
	 */
	focus(): void {
		this.querySelector( 'input' )?.focus();
	}
}
