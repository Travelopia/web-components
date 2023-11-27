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
		this.querySelector( 'input[type="search"]' )?.addEventListener( 'keyup', this.handleSearchChange.bind( this ) );
		this.querySelector( 'input[type="search"]' )?.addEventListener( 'change', this.handleSearchChange.bind( this ) );
	}

	/**
	 * Handle search field value changed.
	 */
	protected handleSearchChange(): void {
		// Get search field and options.
		const search: HTMLInputElement | null = this.querySelector( 'input[type="search"]' );
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
	}

	/**
	 * Clear the search field.
	 */
	clear(): void {
		const search: HTMLInputElement | null = this.querySelector( 'input[type="search"]' );
		if ( search ) {
			search.value = '';
			search.dispatchEvent( new Event( 'change' ) );
		}
	}
}
