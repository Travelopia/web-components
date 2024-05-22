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
		if ( ! multiSelect ) {
			return;
		}

		// Determine pills.
		const pills: NodeListOf<TPMultiSelectPillElement> | null = this.querySelectorAll( 'tp-multi-select-pill' );
		const values: string[] = multiSelect.value ?? [];
		const pillValues: string[] = [];

		// Remove pills that shouldn't exist.
		pills.forEach( ( pill: TPMultiSelectPillElement ): void => {
			const pillValue: string = pill.getAttribute( 'value' ) ?? '';

			if ( '' === pillValue ) {
				return;
			}

			pillValues.push( pillValue );

			if ( ! values.includes( pillValue ) ) {
				pill.remove();
			}
		} );

		// Create new pills.
		const pillsToCreate: string[] = values.filter( ( value: string ) => ! pillValues.includes( value ) );
		pillsToCreate.forEach( ( pillValue: string ): void => {
			if ( '' === pillValue ) {
				return;
			}

			const multiSelectOption: TPMultiSelectOptionElement | null = multiSelect.querySelector( `tp-multi-select-option[value="${ pillValue }"]` );
			if ( ! multiSelectOption ) {
				return;
			}

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
		const newPill = document.createElement( 'tp-multi-select-pill' ) as TPMultiSelectPillElement;
		newPill.setAttribute( 'value', value );

		const pillLabel: HTMLElement = document.createElement( 'span' );
		pillLabel.textContent = label;

		const pillCloseButton: HTMLElement = document.createElement( 'button' );
		pillCloseButton.setAttribute( 'type', 'button' );
		pillCloseButton.textContent = 'x';
		pillCloseButton.addEventListener( 'click', () => {
			newPill.removePill();
		} );

		newPill.appendChild( pillLabel );
		newPill.appendChild( pillCloseButton );

		return newPill;
	}
}
