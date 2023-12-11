/**
 * Internal dependencies.
 */
import { TPMultiSelectOptionElement } from './tp-multi-select-option';
import { TPMultiSelectStatusElement } from './tp-multi-select-status';
import { TPMultiSelectOptionsElement } from './tp-multi-select-options';
import { TPMultiSelectSearchElement } from './tp-multi-select-search';

/**
 * TP Multi Select.
 */
export class TPMultiSelectElement extends HTMLElement {
	/**
	 * Properties.
	 */
	currentlyHighlightedOption: number = -1;
	protected keyboardEventListener: EventListener;

	/**
	 * Constructor.
	 */
	constructor() {
		super();
		this.keyboardEventListener = this.handleKeyboardInputs.bind( this ) as EventListener;
	}

	/**
	 * Connected callback.
	 */
	connectedCallback(): void {
		// Events.
		document.addEventListener( 'click', this.handleDocumentClick.bind( this ) );
		this.addEventListener( 'change', this.update.bind( this ) );

		// Listen for dynamic changes to the option values.
		const options: TPMultiSelectOptionsElement | null = this.querySelector( 'tp-multi-select-options' );
		if ( options ) {
			const mutationObserver: MutationObserver = new MutationObserver( this.initialize.bind( this ) );
			mutationObserver.observe( options, { childList: true, subtree: true } );
		}

		// Initialize component.
		this.initialize();
	}

	/**
	 * Get observed attributes.
	 *
	 * @return {Array} List of observed attributes.
	 */
	static get observedAttributes(): string[] {
		return [ 'open' ];
	}

	/**
	 * Attribute changed callback.
	 *
	 * @param {string} name     Attribute name.
	 * @param {string} oldValue Old value.
	 * @param {string} newValue New value.
	 */
	attributeChangedCallback( name: string = '', oldValue: string = '', newValue: string = '' ): void {
		if ( oldValue === newValue ) {
			return;
		}

		if ( 'open' === name ) {
			if ( 'yes' === newValue ) {
				document.addEventListener( 'keydown', this.keyboardEventListener );
				this.dispatchEvent( new CustomEvent( 'open', { bubbles: true } ) );
			} else {
				this.unHighlightAllOptions();
				document.removeEventListener( 'keydown', this.keyboardEventListener );
				this.dispatchEvent( new CustomEvent( 'close', { bubbles: true } ) );
			}
		}
	}

	/**
	 * Set the value of this component.
	 *
	 * @param {Array} value Value.
	 */
	set value( value: string[] ) {
		if ( ! value || ! Array.isArray( value ) ) {
			return;
		}

		const styledOptions: NodeListOf<TPMultiSelectOptionElement> | null = this.querySelectorAll( 'tp-multi-select-option' );
		styledOptions?.forEach( ( option: TPMultiSelectOptionElement ): void => {
			if ( value.includes( option.getAttribute( 'value' ) ?? '' ) ) {
				option.setAttribute( 'selected', 'selected' );
			} else {
				option.removeAttribute( 'selected' );
			}
		} );

		this.dispatchEvent( new CustomEvent( 'change', { bubbles: true } ) );
	}

	/**
	 * Get the value of this component.
	 *
	 * @return {Array} Value of this component.
	 */
	get value(): string[] {
		const value: string[] = [];

		const selectedOptions: NodeListOf<HTMLOptionElement> | null = this.querySelectorAll( 'select option[selected]' );
		selectedOptions?.forEach( ( option: HTMLOptionElement ) => value.push( option.value ) );

		return value;
	}

	/**
	 * Update the value of the select field.
	 */
	protected updateFormFieldValue(): void {
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
	}

	/**
	 * Update component and sub-components.
	 */
	update(): void {
		// First, update field value.
		this.updateFormFieldValue();

		// Get value.
		const value: string[] = this.value;

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
	 * Initialize component.
	 */
	initialize(): void {
		// Get options.
		const options: NodeListOf<HTMLOptionElement> | null = this.querySelectorAll( 'tp-multi-select-option' );
		if ( ! options ) {
			return;
		}

		// Create select element (if it doesn't already exist).
		let selectElement: HTMLSelectElement | null = this.querySelector( 'select' );
		if ( ! selectElement ) {
			selectElement = document.createElement( 'select' );
			selectElement.setAttribute( 'name', this.getAttribute( 'name' ) ?? '' );

			if ( 'no' !== this.getAttribute( 'multiple' ) ) {
				selectElement.setAttribute( 'multiple', 'multiple' );
			}

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
		// Stuff for single-select.
		if ( 'no' === this.getAttribute( 'multiple' ) ) {
			// First, unselect everything.
			this.unSelectAll();

			// If the value is blank, don't do anything else.
			if ( '' === value ) {
				if ( 'yes' === this.getAttribute( 'close-on-select' ) ) {
					this.removeAttribute( 'open' );
				}
				return;
			}
		}

		// Select all options.
		const styledSelectedOptions: NodeListOf<TPMultiSelectOptionElement> | null = this.querySelectorAll( `tp-multi-select-option[value="${ value }"]` );
		styledSelectedOptions?.forEach( ( option: TPMultiSelectOptionElement ): void => {
			if ( 'yes' !== option.getAttribute( 'disabled' ) ) {
				option.setAttribute( 'selected', 'yes' );
			}
		} );

		// Search stuff.
		const search: TPMultiSelectSearchElement | null = this.querySelector( 'tp-multi-select-search' );
		search?.clear();
		search?.focus();

		// Close the field, if applicable.
		if ( 'yes' === this.getAttribute( 'close-on-select' ) ) {
			this.removeAttribute( 'open' );
		}

		// Trigger events.
		this.dispatchEvent( new CustomEvent( 'select', { bubbles: true } ) );
		this.dispatchEvent( new CustomEvent( 'change', { bubbles: true } ) );
	}

	/**
	 * Select all values.
	 */
	selectAll(): void {
		const styledOptions: NodeListOf<TPMultiSelectOptionElement> | null = this.querySelectorAll( 'tp-multi-select-option' );
		styledOptions?.forEach( ( option: TPMultiSelectOptionElement ): void => {
			if ( 'yes' !== option.getAttribute( 'disabled' ) ) {
				option.setAttribute( 'selected', 'yes' );
			}
		} );

		this.dispatchEvent( new CustomEvent( 'select-all', { bubbles: true } ) );
		this.dispatchEvent( new CustomEvent( 'change', { bubbles: true } ) );
	}

	/**
	 * Un-select a value.
	 *
	 * @param {string} value Value to unselect.
	 */
	unSelect( value: string = '' ): void {
		const styledSelectedOptions: NodeListOf<TPMultiSelectOptionElement> | null = this.querySelectorAll( `tp-multi-select-option[value="${ value }"]` );
		styledSelectedOptions?.forEach( ( option: TPMultiSelectOptionElement ): void => {
			option.removeAttribute( 'selected' );
		} );

		this.dispatchEvent( new CustomEvent( 'unselect', { bubbles: true } ) );
		this.dispatchEvent( new CustomEvent( 'change', { bubbles: true } ) );
	}

	/**
	 * Un-select all values.
	 */
	unSelectAll(): void {
		const styledSelectedOptions: NodeListOf<TPMultiSelectOptionElement> | null = this.querySelectorAll( 'tp-multi-select-option' );
		styledSelectedOptions?.forEach( ( option: TPMultiSelectOptionElement ): void => {
			option.removeAttribute( 'selected' );
		} );

		this.dispatchEvent( new CustomEvent( 'unselect-all', { bubbles: true } ) );
		this.dispatchEvent( new CustomEvent( 'change', { bubbles: true } ) );
	}

	/**
	 * Handle keyboard inputs.
	 *
	 * @param {Event} e Keyboard event.
	 */
	handleKeyboardInputs( e: KeyboardEvent ): void {
		switch ( e.key ) {
			case 'ArrowDown':
				this.highlightNextOption();
				break;
			case 'ArrowUp':
				this.highlightPreviousOption();
				break;
			case 'Enter':
				this.toggleHighlightedOption();
				break;
			case 'Escape':
				this.unHighlightAllOptions();
				this.removeAttribute( 'open' );
				break;
		}
	}

	/**
	 * Highlight the next option.
	 */
	highlightNextOption(): void {
		// Get options.
		const options: NodeListOf<TPMultiSelectOptionElement> | null = this.querySelectorAll( 'tp-multi-select-option:not([hidden="yes"])' );
		if ( ! options ) {
			this.currentlyHighlightedOption = -1;
			return;
		}

		// Highlight next option.
		if ( this.currentlyHighlightedOption === options.length - 1 ) {
			return;
		}

		this.currentlyHighlightedOption++;

		// Set option attributes based on highlight.
		options.forEach( ( option: TPMultiSelectOptionElement, index: number ): void => {
			if ( this.currentlyHighlightedOption === index ) {
				option.setAttribute( 'highlighted', 'yes' );
			} else {
				option.removeAttribute( 'highlighted' );
			}
		} );
	}

	/**
	 * Highlight previous option.
	 */
	highlightPreviousOption(): void {
		// Get options.
		const options: NodeListOf<TPMultiSelectOptionElement> | null = this.querySelectorAll( 'tp-multi-select-option:not([hidden="yes"])' );
		if ( ! options ) {
			this.currentlyHighlightedOption = -1;
			return;
		}

		// Highlight next option.
		if ( this.currentlyHighlightedOption === 0 ) {
			return;
		}

		this.currentlyHighlightedOption--;

		// Set option attributes based on highlight.
		options.forEach( ( option: TPMultiSelectOptionElement, index: number ): void => {
			if ( this.currentlyHighlightedOption === index ) {
				option.setAttribute( 'highlighted', 'yes' );
			} else {
				option.removeAttribute( 'highlighted' );
			}
		} );
	}

	/**
	 * Toggle highlighted option.
	 */
	toggleHighlightedOption(): void {
		const option: TPMultiSelectOptionElement | null = this.querySelector( `tp-multi-select-option[highlighted="yes"]` );
		option?.toggle( null );
	}

	/**
	 * Un-highlight all options.
	 */
	unHighlightAllOptions(): void {
		this.currentlyHighlightedOption = -1;

		const options: NodeListOf<TPMultiSelectOptionElement> | null = this.querySelectorAll( 'tp-multi-select-option' );
		if ( options ) {
			options.forEach( ( option: TPMultiSelectOptionElement ): void => {
				option.removeAttribute( 'highlighted' );
			} );
		}
	}
}
