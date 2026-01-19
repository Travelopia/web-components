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
		// Initialize parent.
		super();

		// Events.
		this.keyboardEventListener = this.handleKeyboardInputs.bind( this ) as EventListener;
		document.addEventListener( 'click', this.handleDocumentClick.bind( this ) );
		this.addEventListener( 'change', this.update.bind( this ) );
		this.addEventListener( 'focusout', this.handleFocusOut.bind( this ) );

		// Get options.
		const options: TPMultiSelectOptionsElement | null = this.querySelector( 'tp-multi-select-options' );

		// Listen for dynamic changes to the option values.
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
		// Attributes to observe.
		return [ 'open', 'aria' ];
	}

	/**
	 * Check if ARIA management is enabled.
	 *
	 * @return {boolean} Whether ARIA is enabled.
	 */
	isAriaEnabled(): boolean {
		// Return whether ARIA management is enabled (default: yes).
		return 'no' !== this.getAttribute( 'aria' );
	}

	/**
	 * Attribute changed callback.
	 *
	 * @param {string} name     Attribute name.
	 * @param {string} oldValue Old value.
	 * @param {string} newValue New value.
	 */
	attributeChangedCallback( name: string = '', oldValue: string = '', newValue: string = '' ): void {
		// If no changes.
		if ( oldValue === newValue ) {
			// Exit.
			return;
		}

		// Changed attribute name is 'open'.
		if ( 'open' === name ) {
			// If new value is 'yes' then open the dropdown.
			if ( 'yes' === newValue ) {
				document.addEventListener( 'keydown', this.keyboardEventListener );
				this.updateAriaExpanded( true );
				this.highlightNextOption();
				this.dispatchEvent( new CustomEvent( 'open', { bubbles: true } ) );
			} else {
				this.unHighlightAllOptions();
				document.removeEventListener( 'keydown', this.keyboardEventListener );
				this.updateAriaExpanded( false );
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
		// Bail if value is not an array.
		if ( ! value || ! Array.isArray( value ) ) {
			// Bail early.
			return;
		}

		// Set the value of the select field.
		const styledOptions: NodeListOf<TPMultiSelectOptionElement> | null = this.querySelectorAll( 'tp-multi-select-option' );
		styledOptions?.forEach( ( option: TPMultiSelectOptionElement ): void => {
			// Check if the value is in the array.
			if ( value.includes( option.getAttribute( 'value' ) ?? '' ) ) {
				option.setAttribute( 'selected', 'yes' );
			} else {
				option.removeAttribute( 'selected' );
			}
		} );

		// Dispatch change event.
		this.dispatchEvent( new CustomEvent( 'change', { bubbles: true } ) );
	}

	/**
	 * Get the value of this component.
	 *
	 * @return {Array} Value of this component.
	 */
	get value(): string[] {
		// Get the value of the select field.
		const value: string[] = [];

		// Get selected options.
		const selectedOptions: NodeListOf<HTMLOptionElement> | null = this.querySelectorAll( 'select option[selected]' );
		selectedOptions?.forEach( ( option: HTMLOptionElement ) => {
			// Get option value.
			const optionValue = option.getAttribute( 'value' );

			// Add value to array.
			if ( optionValue ) {
				value.push( optionValue );
			}
		} );

		// Return value.
		return value;
	}

	/**
	 * Update the value of the select field.
	 */
	protected updateFormFieldValue(): void {
		// Get options.
		const styledSelectedOptions: NodeListOf<TPMultiSelectOptionElement> | null = this.querySelectorAll( `tp-multi-select-option` );
		const selectField: HTMLSelectElement | null = this.querySelector( 'select' );

		// Bail if there's no styled selected options or select field.
		if ( ! styledSelectedOptions || ! selectField ) {
			// Bail.
			return;
		}

		// Get selected options.
		const selectOptions: HTMLOptionElement[] = Array.from( selectField.options );

		// Traverse options.
		styledSelectedOptions.forEach( ( option: TPMultiSelectOptionElement ): void => {
			// Get option value.
			const optionValue = option.getAttribute( 'value' ) ?? '';

			// If option value is present.
			if ( optionValue ) {
				const matchingSelectOption: HTMLOptionElement | undefined = selectOptions.find( ( selectOption ) => selectOption.value === optionValue );

				// Update select field.
				if ( 'yes' === option.getAttribute( 'selected' ) ) {
					// Update select field.
					if ( matchingSelectOption ) {
						matchingSelectOption.setAttribute( 'selected', 'selected' );
					} else {
						const newOption: HTMLOptionElement = document.createElement( 'option' );
						newOption.setAttribute( 'value', option.getAttribute( 'value' ) ?? '' );
						newOption.setAttribute( 'selected', 'selected' );
						selectField?.append( newOption );
					}
				} else {
					matchingSelectOption?.remove();
				}
			}
		} );

		// Dispatch events.
		selectField.dispatchEvent( new Event( 'change' ) );
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

		// Get status.
		const status: TPMultiSelectStatusElement | null = this.querySelector( 'tp-multi-select-status' );

		// Update status.
		if ( status ) {
			// Update status.
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
		// Close on click outside.
		if ( this !== e.target && ! this.contains( e.target as Node ) ) {
			this.removeAttribute( 'open' );
		}
	}

	/**
	 * Initialize component.
	 */
	initialize(): void {
		// Get select element.
		let selectElement: HTMLSelectElement | null = this.querySelector( 'select' );

		// Create select element (if it doesn't already exist).
		if ( ! selectElement ) {
			selectElement = document.createElement( 'select' );
			selectElement.setAttribute( 'name', this.getAttribute( 'name' ) ?? '' );

			// Get form reference.
			const formReference = this.getAttribute( 'form' );

			// Add form reference.
			if ( formReference ) {
				selectElement.setAttribute( 'form', formReference );
			}

			// Set multiple.
			if ( 'no' !== this.getAttribute( 'multiple' ) ) {
				selectElement.setAttribute( 'multiple', 'multiple' );
			}

			// Append.
			this.append( selectElement );
		} else {
			selectElement.innerHTML = '';
		}

		// Update components for selected options.
		this.update();
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
				// Close the field, if applicable.
				if ( 'yes' === this.getAttribute( 'close-on-select' ) ) {
					this.removeAttribute( 'open' );
				}

				// Exit.
				return;
			}
		}

		// Select all options.
		const styledSelectedOptions: NodeListOf<TPMultiSelectOptionElement> | null = this.querySelectorAll( `tp-multi-select-option[value="${ value }"]` );
		styledSelectedOptions?.forEach( ( option: TPMultiSelectOptionElement ): void => {
			// Update select field.
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

		// Update component.
		this.update();
	}

	/**
	 * Select all values.
	 */
	selectAll(): void {
		// Get all options.
		const styledOptions: NodeListOf<TPMultiSelectOptionElement> | null = this.querySelectorAll( 'tp-multi-select-option' );
		styledOptions?.forEach( ( option: TPMultiSelectOptionElement ): void => {
			// Update select field.
			if ( 'yes' !== option.getAttribute( 'disabled' ) ) {
				option.setAttribute( 'selected', 'yes' );
			}
		} );

		// Update component.
		this.update();
	}

	/**
	 * Un-select a value.
	 *
	 * @param {string} value Value to unselect.
	 */
	unSelect( value: string = '' ): void {
		// Get all options with the specified value.
		const styledSelectedOptions: NodeListOf<TPMultiSelectOptionElement> | null = this.querySelectorAll( `tp-multi-select-option[value="${ value }"]` );
		styledSelectedOptions?.forEach( ( option: TPMultiSelectOptionElement ): void => {
			// Remove selected attribute.
			option.removeAttribute( 'selected' );
		} );

		// update component.
		this.update();
	}

	/**
	 * Un-select all values.
	 */
	unSelectAll(): void {
		// Get all options.
		const styledSelectedOptions: NodeListOf<TPMultiSelectOptionElement> | null = this.querySelectorAll( 'tp-multi-select-option' );
		styledSelectedOptions?.forEach( ( option: TPMultiSelectOptionElement ): void => {
			// Remove selected attribute.
			option.removeAttribute( 'selected' );
		} );

		// Update component.
		this.update();
	}

	/**
	 * Handle keyboard inputs.
	 *
	 * @param {Event} e Keyboard event.
	 */
	handleKeyboardInputs( e: KeyboardEvent ): void {
		// Keyboard events.
		switch ( e.key ) {
			case 'ArrowDown':
				e.preventDefault();
				this.highlightNextOption();
				break;
			case 'ArrowUp':
				e.preventDefault();
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

		// Bail early if there are no  options. Set the currently highlighted option to -1 (no more options to highlight).
		if ( ! options ) {
			this.currentlyHighlightedOption = -1;

			// Exit.
			return;
		}

		// Find the next option to be highlighted. Assume next option is the favorable option.
		let nextToBeHighlighted = this.currentlyHighlightedOption + 1;

		// Keep iterating to skip over disabled options until we find a suitable option.
		while ( nextToBeHighlighted < options.length && options[ nextToBeHighlighted ].getAttribute( 'disabled' ) === 'yes' ) {
			nextToBeHighlighted++;
		}

		// If there are no more options to highlight, exit. Here, the last highlighted option keeps highlighted.
		if ( nextToBeHighlighted === options.length ) {
			// Exit.
			return;
		}

		// Remove highlight from the current option, if any.
		if ( this.currentlyHighlightedOption !== -1 ) {
			options[ this.currentlyHighlightedOption ].removeAttribute( 'highlighted' );
		}

		// Highlight the found option.
		options[ nextToBeHighlighted ].setAttribute( 'highlighted', 'yes' );

		// Scroll the highlighted option into view with smooth behavior.
		options[ nextToBeHighlighted ].scrollIntoView( { behavior: 'smooth', block: 'nearest' } );

		// Update aria-activedescendant.
		this.updateAriaActiveDescendant( options[ nextToBeHighlighted ].id || null );

		// Update the currentlyHighlightedOption for the next iteration.
		this.currentlyHighlightedOption = nextToBeHighlighted;
	}

	/**
	 * Highlight previous option.
	 */
	highlightPreviousOption(): void {
		// Get options.
		const options: NodeListOf<TPMultiSelectOptionElement> | null = this.querySelectorAll( 'tp-multi-select-option:not([hidden="yes"])' );

		// Bail early if there are no  options. Set the currently highlighted option to -1 (no more options to highlight).
		if ( ! options ) {
			this.currentlyHighlightedOption = -1;

			// Exit.
			return;
		}

		// Find the previous option to be highlighted. Assume previous option is the favorable option.
		let previousToBeHighlighted = this.currentlyHighlightedOption - 1;

		// Keep iterating to skip over disabled options until we find a suitable option.
		while ( previousToBeHighlighted >= 0 && options[ previousToBeHighlighted ].getAttribute( 'disabled' ) === 'yes' ) {
			previousToBeHighlighted--;
		}

		// If there are no more options to highlight, exit.
		if ( previousToBeHighlighted < 0 ) {
			// Exit.
			return;
		}

		// Remove highlight from the current option, if any.
		if ( this.currentlyHighlightedOption !== 0 ) {
			options[ this.currentlyHighlightedOption ].removeAttribute( 'highlighted' );
		}

		// Highlight the found option.
		options[ previousToBeHighlighted ].setAttribute( 'highlighted', 'yes' );

		// Scroll the highlighted option into view with smooth behavior.
		options[ previousToBeHighlighted ].scrollIntoView( { behavior: 'smooth', block: 'nearest' } );

		// Update aria-activedescendant.
		this.updateAriaActiveDescendant( options[ previousToBeHighlighted ].id || null );

		// Update the currentlyHighlightedOption for the next iteration.
		this.currentlyHighlightedOption = previousToBeHighlighted;
	}

	/**
	 * Toggle highlighted option.
	 */
	toggleHighlightedOption(): void {
		// Get option and if it exists set it to null.
		const option: TPMultiSelectOptionElement | null = this.querySelector( `tp-multi-select-option[highlighted="yes"]` );
		option?.toggle( null );
	}

	/**
	 * Un-highlight all options.
	 */
	unHighlightAllOptions(): void {
		// Reset the currentlyHighlightedOption.
		this.currentlyHighlightedOption = -1;

		// Get options.
		const options: NodeListOf<TPMultiSelectOptionElement> | null = this.querySelectorAll( 'tp-multi-select-option' );

		// If there are options, un-highlight them.
		if ( options ) {
			options.forEach( ( option: TPMultiSelectOptionElement ): void => {
				// Remove highlighted attribute.
				option.removeAttribute( 'highlighted' );
			} );
		}

		// Clear aria-activedescendant.
		this.updateAriaActiveDescendant( null );
	}

	/**
	 * Get the combobox element (search input or field).
	 *
	 * @return {HTMLElement | null} The combobox element.
	 */
	getComboboxElement(): HTMLElement | null {
		// If search input exists, it's the combobox.
		const searchInput: HTMLInputElement | null = this.querySelector( 'tp-multi-select-search input' );

		// Return search input if it exists.
		if ( searchInput ) {
			// Return search input.
			return searchInput;
		}

		// Otherwise, the field is the combobox.
		return this.querySelector( 'tp-multi-select-field' );
	}

	/**
	 * Update aria-expanded on the combobox element.
	 *
	 * @param {boolean} isOpen Whether the dropdown is open.
	 */
	updateAriaExpanded( isOpen: boolean ): void {
		// Check if ARIA is enabled.
		if ( ! this.isAriaEnabled() ) {
			// Early return.
			return;
		}

		// Get combobox element.
		const combobox = this.getComboboxElement();

		// Update aria-expanded if combobox exists.
		if ( combobox ) {
			combobox.setAttribute( 'aria-expanded', isOpen ? 'true' : 'false' );
		}
	}

	/**
	 * Update aria-activedescendant on the combobox element.
	 *
	 * @param {string | null} optionId The ID of the highlighted option, or null to clear.
	 */
	updateAriaActiveDescendant( optionId: string | null ): void {
		// Check if ARIA is enabled.
		if ( ! this.isAriaEnabled() ) {
			// Early return.
			return;
		}

		// Get combobox element.
		const combobox = this.getComboboxElement();

		// Update aria-activedescendant if combobox exists.
		if ( combobox ) {
			// Set or remove aria-activedescendant based on optionId.
			if ( optionId ) {
				combobox.setAttribute( 'aria-activedescendant', optionId );
			} else {
				combobox.removeAttribute( 'aria-activedescendant' );
			}
		}
	}

	/**
	 * Handle focus out events to close the dropdown.
	 *
	 * @param {FocusEvent} e Focus event.
	 */
	handleFocusOut( e: FocusEvent ): void {
		// Don't close if focus is moving within the multi-select.
		if ( e.relatedTarget && this.contains( e.relatedTarget as Node ) ) {
			// Early return.
			return;
		}

		// Close the dropdown.
		this.removeAttribute( 'open' );
	}
}
