/**
 * Internal dependencies.
 */
import { TPMultiSelectOptionElement } from './tp-multi-select-option';
import { TPMultiSelectStatusElement } from './tp-multi-select-status';
import { TPMultiSelectOptionsElement } from './tp-multi-select-options';

/**
 * TP Multi Select.
 */
export class TPMultiSelectElement extends HTMLElement {
	/**
	 * Connected callback.
	 */
	connectedCallback(): void {
		// Events.
		document.addEventListener( 'click', this.handleDocumentClick.bind( this ) );
		this.addEventListener( 'selected', () => this.updateValue() );
		this.addEventListener( 'un-selected', () => this.updateValue() );
		this.addEventListener( 'change', () => this.handleChange() );

		// Listen for changes to the options.
		const options: TPMultiSelectOptionsElement | null = this.querySelector( 'tp-multi-select-options' );
		if ( options ) {
			const mutationObserver: MutationObserver = new MutationObserver( this.update.bind( this ) );
			mutationObserver.observe( options, { childList: true, subtree: true } );
		}

		// Update component.
		this.update();
	}

	/**
	 * Update the value of the select field.
	 */
	updateValue(): void {
		// Get options.
		const styledSelectedOptions: NodeListOf<TPMultiSelectOptionElement> | null = this.querySelectorAll( `tp-multi-select-option` );
		const selectFieldOptions: NodeListOf<HTMLOptionElement> | null = this.querySelectorAll( 'select option' );

		if ( ! styledSelectedOptions || ! selectFieldOptions ) {
			return;
		}

		// Traverse options.
		styledSelectedOptions.forEach( ( option: TPMultiSelectOptionElement ): void => {
			// Get matching select field options.
			const matchingSelectOptions: HTMLOptionElement[] = [ ...selectFieldOptions ].filter( ( selectOption: HTMLOptionElement ): boolean =>
				selectOption.getAttribute( 'value' ) === option.getAttribute( 'value' ) );

			if ( 0 === matchingSelectOptions.length ) {
				return;
			}

			// Check whether to mark them as selected or not.
			if ( 'yes' === option.getAttribute( 'selected' ) ) {
				matchingSelectOptions.forEach( ( matchingSelectOption: HTMLOptionElement ): void => {
					matchingSelectOption.selected = true;
					matchingSelectOption.setAttribute( 'selected', 'selected' );
				} );
			} else {
				matchingSelectOptions.forEach( ( matchingSelectOption: HTMLOptionElement ): void => {
					matchingSelectOption.selected = false;
					matchingSelectOption.removeAttribute( 'selected' );
				} );
			}
		} );

		// Dispatch events.
		this.querySelector( 'select' )?.dispatchEvent( new Event( 'change' ) );
		this.dispatchEvent( new CustomEvent( 'change', { bubbles: true } ) );
	}

	/**
	 * Handle value changed.
	 */
	handleChange(): void {
		// Get value.
		const value: string[] = this.getValue();

		// Toggle selected attribute.
		if ( 0 !== value.length ) {
			this.setAttribute( 'selected', 'yes' );
		} else {
			this.removeAttribute( 'selected' );
		}

		// Update status.
		const status: TPMultiSelectStatusElement | null = this.querySelector( 'tp-multi-select-status' );
		if ( status ) {
			if ( value.length > 0 ) {
				status.setAttribute( 'total', value.length.toString() );
			} else {
				status.removeAttribute( 'total' );
			}
		}
	}

	/**
	 * Get value.
	 */
	getValue(): string[] {
		const value: string[] = [];

		const selectedOptions: NodeListOf<HTMLOptionElement> | null = this.querySelectorAll( 'select option[selected]' );
		selectedOptions?.forEach( ( option: HTMLOptionElement ) => value.push( option.value ) );

		return value;
	}

	/**
	 * Handle clicking the document.
	 *
	 * @param {Event} e Event.
	 */
	protected handleDocumentClick( e: Event ): void {
		if ( this !== e.target && ! this.contains( e.target as Node ) ) {
			this.removeAttribute( 'open' );
		}
	}

	/**
	 * Update component.
	 */
	update(): void {
		// Get options.
		const options: NodeListOf<HTMLOptionElement> | null = this.querySelectorAll( 'tp-multi-select-option' );
		if ( ! options ) {
			return;
		}

		// Create select element (if it doesn't already exist).
		let selectElement: HTMLSelectElement | null = this.querySelector( 'select' );
		if ( ! selectElement ) {
			selectElement = document.createElement( 'select' );
			selectElement.setAttribute( 'multiple', 'multiple' );
			this.append( selectElement );
		} else {
			selectElement.innerHTML = '';
		}

		// Append new options.
		options.forEach( ( option: HTMLOptionElement ): void => {
			const newOption: HTMLOptionElement = document.createElement( 'option' );
			newOption.setAttribute( 'value', option.getAttribute( 'value' ) ?? '' );
			selectElement?.append( newOption );
		} );
	}

	/**
	 * Select a value.
	 *
	 * @param {string} value Value to select.
	 */
	select( value: string = '' ): void {
		const styledSelectedOptions: NodeListOf<TPMultiSelectOptionElement> | null = this.querySelectorAll( `tp-multi-select-option[value="${ value }"]` );
		styledSelectedOptions?.forEach( ( option: TPMultiSelectOptionElement ): void => {
			option.setAttribute( 'selected', 'yes' );
		} );
		this.dispatchEvent( new CustomEvent( 'selected', { bubbles: true } ) );
	}

	/**
	 * Un-select a value.
	 *
	 * @param {string} value Value to un-select.
	 */
	unSelect( value: string = '' ): void {
		const styledSelectedOptions: NodeListOf<TPMultiSelectOptionElement> | null = this.querySelectorAll( `tp-multi-select-option[value="${ value }"]` );
		styledSelectedOptions?.forEach( ( option: TPMultiSelectOptionElement ): void => {
			option.removeAttribute( 'selected' );
		} );
		this.dispatchEvent( new CustomEvent( 'un-selected', { bubbles: true } ) );
	}
}
