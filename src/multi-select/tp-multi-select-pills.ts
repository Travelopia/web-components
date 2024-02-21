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
	 * Connected callback.
	 */
	connectedCallback(): void {
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

			const newPill: HTMLElement = document.createElement( 'tp-multi-select-pill' );
			newPill.setAttribute( 'value', pillValue );
			newPill.innerHTML = `
			<span>${ multiSelectOption.getAttribute( 'label' ) ?? '' }</span>
			<button>x</button>
			`;
			this.appendChild( newPill );
		} );
	}
}
