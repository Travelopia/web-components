/**
 * Internal dependencies.
 */
import { TPMultiSelectElement } from './tp-multi-select';

/**
 * TP Multi Select Option.
 */
export class TPMultiSelectOptionElement extends HTMLElement {
	/**
	 * Properties.
	 */
	private initialized: boolean = false;

	/**
	 * Connected callback.
	 */
	connectedCallback(): void {
		// Return early if already initialized.
		if ( true === this.initialized ) {
			return;
		}

		// Set initialized flag to true.
		this.initialized = true;

		this.addEventListener( 'click', this.toggle.bind( this ) );
	}

	/**
	 * Select / un-select this option.
	 *
	 * @param {Event} e Click event.
	 */
	toggle( e: Event | null ): void {
		e?.preventDefault();
		e?.stopPropagation();

		const multiSelect: TPMultiSelectElement | null = this.closest( 'tp-multi-select' );
		const value: string = this.getAttribute( 'value' ) ?? '';

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
		multiSelect?.dispatchEvent( new CustomEvent( 'change', { bubbles: true } ) );
	}
}
