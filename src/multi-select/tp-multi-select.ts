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
	private styledOptions: NodeListOf<TPMultiSelectOptionElement> | null = null;
	private search: TPMultiSelectSearchElement | null = null;
	private status: TPMultiSelectStatusElement | null = null;

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
		this.search = this.querySelector( 'tp-multi-select-search' );
		this.styledOptions = this.querySelectorAll( `tp-multi-select-option` );
		this.status = this.querySelector( 'tp-multi-select-status' );

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

		this.styledOptions?.forEach( ( option: TPMultiSelectOptionElement ): void => {
			if ( value.includes( option.getAttribute( 'value' ) ?? '' ) ) {
				option.setAttribute( 'selected', 'yes' );
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
		selectedOptions?.forEach( ( option: HTMLOptionElement ) => {
			const optionValue = option.getAttribute( 'value' );
			if ( optionValue ) {
				value.push( optionValue );
			}
		} );
		return value;
	}

	/**
	 * Update the value of the select field.
	 */
	protected updateFormFieldValue(): void {
		// Get options.
		const styledSelectedOptions: NodeListOf<TPMultiSelectOptionElement> | null = this.styledOptions;
		const selectField: HTMLSelectElement | null = this.querySelector( 'select' );

		if ( ! styledSelectedOptions || ! selectField ) {
			return;
		}

		const selectOptions: Map<string, HTMLOptionElement> = new Map( Array.from( selectField.options ).map( ( option ) => [ option.value, option ] ) );

		// Traverse options.
		styledSelectedOptions.forEach( ( option: TPMultiSelectOptionElement ): void => {
			const optionValue = option.getAttribute( 'value' ) ?? '';
			if ( optionValue ) {
				const matchingSelectOption: HTMLOptionElement | undefined = selectOptions.get( optionValue );

				if ( 'yes' === option.getAttribute( 'selected' ) ) {
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

		// Update status.
		if ( this.status ) {
			if ( value.length > 0 ) {
				this.status.setAttribute( 'total', value.length.toString() );
			} else {
				this.status.removeAttribute( 'total' );
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
				if ( 'yes' === this.getAttribute( 'close-on-select' ) ) {
					this.removeAttribute( 'open' );
				}
				return;
			}
		}

		// Select all options.
		this.styledOptions?.forEach( ( option: TPMultiSelectOptionElement ): void => {
			if ( value.toString() === option.getAttribute( 'value' ) && 'yes' !== option.getAttribute( 'disabled' ) ) {
				option.setAttribute( 'selected', 'yes' );
			}
		} );

		// Search stuff.
		this.search?.clear();
		this.search?.focus();

		// Close the field, if applicable.
		if ( 'yes' === this.getAttribute( 'close-on-select' ) ) {
			this.removeAttribute( 'open' );
		}
		this.update();
	}

	/**
	 * Select all values.
	 */
	selectAll(): void {
		this.styledOptions?.forEach( ( option: TPMultiSelectOptionElement ): void => {
			if ( 'yes' !== option.getAttribute( 'disabled' ) ) {
				option.setAttribute( 'selected', 'yes' );
			}
		} );
		this.update();
	}

	/**
	 * Un-select a value.
	 *
	 * @param {string} value Value to unselect.
	 */
	unSelect( value: string = '' ): void {
		this.styledOptions?.forEach( ( option: TPMultiSelectOptionElement ): void => {
			if ( value.toString() === option.getAttribute( 'value' ) ) {
				option.removeAttribute( 'selected' );
			}
		} );
		this.update();
	}

	/**
	 * Un-select all values.
	 */
	unSelectAll(): void {
		this.styledOptions?.forEach( ( option: TPMultiSelectOptionElement ): void => {
			option.removeAttribute( 'selected' );
		} );
		this.update();
	}

	/**
	 * Handle keyboard inputs.
	 *
	 * @param {Event} e Keyboard event.
	 */
	handleKeyboardInputs( e: KeyboardEvent ): void {
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
		const options: TPMultiSelectOptionElement[] | null = this.styledOptions ? Array.from( this.styledOptions ).filter( ( option: TPMultiSelectOptionElement ) => 'yes' !== option.getAttribute( 'hidden' ) ) : [];
		if ( ! options ) {
			this.currentlyHighlightedOption = -1;
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

		// Update the currentlyHighlightedOption for the next iteration.
		this.currentlyHighlightedOption = nextToBeHighlighted;
	}

	/**
	 * Highlight previous option.
	 */
	highlightPreviousOption(): void {
		// Get options.
		const options: TPMultiSelectOptionElement[] | null = this.styledOptions ? Array.from( this.styledOptions ).filter( ( option: TPMultiSelectOptionElement ) => 'yes' !== option.getAttribute( 'hidden' ) ) : [];
		if ( ! options ) {
			this.currentlyHighlightedOption = -1;
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

		// Update the currentlyHighlightedOption for the next iteration.
		this.currentlyHighlightedOption = previousToBeHighlighted;
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

		const options = this.styledOptions;
		if ( options ) {
			options.forEach( ( option: TPMultiSelectOptionElement ): void => {
				option.removeAttribute( 'highlighted' );
			} );
		}
	}
}
