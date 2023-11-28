/**
 * Internal dependencies.
 */
import { TPMultiSelectOptionElement } from './tp-multi-select-option';

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

		input.addEventListener( 'keyup', this.handleSearchChange.bind( this ) );
		input.addEventListener( 'change', this.handleSearchChange.bind( this ) );
		this.addEventListener( 'click', this.handleClick.bind( this ) );
	}

	/**
	 * Handle search field value changed.
	 */
	protected handleSearchChange(): void {
		// Get search field and options.
		const search: HTMLInputElement | null = this.querySelector( 'input' );
		const options: NodeListOf<TPMultiSelectOptionElement> | undefined = this.closest( 'tp-multi-select' )?.querySelectorAll( 'tp-multi-select-option' );
		if ( ! search || ! options ) {
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
			this.closest( 'tp-multi-select' )?.setAttribute( 'open', 'yes' );
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
			this.closest( 'tp-multi-select' )?.removeAttribute( 'open' );
			search.dispatchEvent( new Event( 'change' ) );
		}
	}

	/**
	 * Set focus on the search field.
	 */
	focus(): void {
		this.querySelector( 'input' )?.focus();
	}
}
