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
	 * Connected callback.
	 */
	connectedCallback(): void {
		this.closest( 'tp-multi-select' )?.addEventListener( 'change', this.handleValueChanged.bind( this ) );
		this.addEventListener( 'click', this.toggleSelectAll.bind( this ) );
	}

	/**
	 * Handle value changed.
	 */
	handleValueChanged(): void {
		const multiSelect: TPMultiSelectElement | null = this.closest( 'tp-multi-select' );
		const options: NodeListOf<TPMultiSelectOptionElement> | null | undefined = multiSelect?.querySelectorAll( 'tp-multi-select-option' );
		if ( ! multiSelect || ! options ) {
			return;
		}

		if ( Array.from( options ).filter( ( optionNode ) => optionNode.getAttribute( 'disabled' ) !== 'yes' ).length === multiSelect.value.length ) {
			this.setAttribute( 'selected', 'yes' );
			this.innerHTML = this.getAttribute( 'unselect-text' ) ?? '';
		} else {
			this.removeAttribute( 'selected' );
			this.innerHTML = this.getAttribute( 'select-text' ) ?? '';
		}
	}

	/**
	 * Toggle select all.
	 */
	toggleSelectAll(): void {
		const multiSelect: TPMultiSelectElement | null = this.closest( 'tp-multi-select' );
		if ( ! multiSelect ) {
			return;
		}

		if ( 'yes' !== this.getAttribute( 'selected' ) ) {
			multiSelect.selectAll();
			multiSelect.dispatchEvent( new CustomEvent( 'select-all', { bubbles: true } ) );
		} else {
			multiSelect.unSelectAll();
			multiSelect.dispatchEvent( new CustomEvent( 'unselect-all', { bubbles: true } ) );
		}

		multiSelect.dispatchEvent( new CustomEvent( 'change', {
			detail: {
				selection: 'all',
			},
			bubbles: true,
		} ) );
	}
}
