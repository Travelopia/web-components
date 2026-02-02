/**
 * Internal dependencies.
 */
import { TPMultiSelectElement } from './tp-multi-select';
import { TPMultiSelectPillElement } from './tp-multi-select-pill';
import { TPMultiSelectOptionElement } from './tp-multi-select-option';

/**
 * TP Multi Select Pills.
 */
export class TPMultiSelectPillsElement extends HTMLElement {
	/**
	 * Constructor.
	 */
	constructor() {
		// Initialize parent.
		super();

		// Events.
		this.closest( 'tp-multi-select' )?.addEventListener( 'change', this.update.bind( this ) );
		this.closest( 'tp-multi-select' )?.querySelector( 'select' )?.addEventListener( 'change', ( () => this.update() ) as EventListener );

		// Update.
		this.update();
	}

	/**
	 * Update this component.
	 */
	update(): void {
		// Get multi-select.
		const multiSelect: TPMultiSelectElement | null = this.closest( 'tp-multi-select' );

		// Bail if there's no multi-select.
		if ( ! multiSelect ) {
			// Bail early.
			return;
		}

		// Determine pills.
		const pills: NodeListOf<TPMultiSelectPillElement> | null = this.querySelectorAll( 'tp-multi-select-pill' );
		const values: string[] = [ ...new Set( multiSelect.value ) ];
		const pillValues: string[] = [];

		// Remove pills that shouldn't exist.
		pills.forEach( ( pill: TPMultiSelectPillElement ): void => {
			// Get pill value.
			const pillValue: string = pill.getAttribute( 'value' ) ?? '';

			// Early return if pill value is empty string.
			if ( '' === pillValue ) {
				// Early return.
				return;
			}

			// Add pill value to the array.
			pillValues.push( pillValue );

			// Remove pill if it doesn't exist in the values.
			if ( ! values.includes( pillValue ) ) {
				pill.remove();
			}
		} );

		// Create new pills.
		const pillsToCreate: string[] = values.filter( ( value: string ) => ! pillValues.includes( value ) );

		// Create pills.
		pillsToCreate.forEach( ( pillValue: string ): void => {
			// Early return if pill value is empty string.
			if ( '' === pillValue ) {
				// Early return.
				return;
			}

			// Get multi-select option.
			const multiSelectOption: TPMultiSelectOptionElement | null = multiSelect.querySelector( `tp-multi-select-option[value="${ pillValue }"]` );

			// Bail early if there's no multi-select option.
			if ( ! multiSelectOption ) {
				// Early return.
				return;
			}

			// Add pill.
			this.appendChild( this.createPill( pillValue, multiSelectOption.getAttribute( 'label' ) ?? '' ) );
		} );
	}

	/**
	 * Create a new pill.
	 *
	 * @param {string} value Pill value.
	 * @param {string} label Pill label.
	 *
	 * @return {TPMultiSelectPillElement} New pill.
	 */
	createPill( value: string, label: string ): TPMultiSelectPillElement {
		// Create pill and set value attribute.
		const newPill = document.createElement( 'tp-multi-select-pill' ) as TPMultiSelectPillElement;
		newPill.setAttribute( 'value', value );

		// Create pill label.
		const pillLabel: HTMLElement = document.createElement( 'span' );
		pillLabel.textContent = label;

		// Create pill close button.
		const pillCloseButton: HTMLElement = document.createElement( 'button' );
		pillCloseButton.setAttribute( 'type', 'button' );

		// Use remove-format for button text, falling back to 'x'.
		const removeFormat = this.getAttribute( 'remove-format' );
		pillCloseButton.textContent = removeFormat ? removeFormat.replace( '$label', label ) : 'x';

		// Add event listener.
		pillCloseButton.addEventListener( 'click', () => {
			// On click, run removePill method.
			newPill.removePill();
		} );

		// Stop propagation on keydown to prevent parent handlers from intercepting.
		pillCloseButton.addEventListener( 'keydown', ( e: KeyboardEvent ) => {
			// Check if Enter or Space was pressed.
			if ( 'Enter' === e.key || ' ' === e.key ) {
				e.stopPropagation();
			}
		} );

		// Append label and close button to pill.
		newPill.appendChild( pillLabel );
		newPill.appendChild( pillCloseButton );

		// Return newPill element.
		return newPill;
	}
}
