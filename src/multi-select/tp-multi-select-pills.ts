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
		// Get multi-select.
		const multiSelect: TPMultiSelectElement | null = this.closest( 'tp-multi-select' );
		const selectAllText: string = multiSelect?.getAttribute( 'select-all-text' ) || '';

		// Add pills.
		multiSelect?.addEventListener( 'change', ( ( event: CustomEvent ) => this.handleSelectionChange( event ) ) as EventListener );
		this.update();

		// If select all text is not empty
		if ( selectAllText ) {
			// Update the pills markup with select all text.
			multiSelect?.addEventListener( 'select-all', () => this.updateSelectAllText( selectAllText ) );
			multiSelect?.addEventListener( 'unselect-all', () => this.updateSelectAllText( '' ) );
		}
	}

	/**
	 * Update Select All text.
	 *
	 * @param {string} text
	 */
	updateSelectAllText( text: string = '' ) {
		this.innerHTML = text;
	}

	handleSelectionChange( event: CustomEvent ) {
		// Get multi-select.
		const multiSelect: TPMultiSelectElement | null = this.closest( 'tp-multi-select' );
		const selectAllText: string = multiSelect?.getAttribute( 'select-all-text' ) || '';

		/**
		 * Only update the pills if it's not the selection all event, and
		 * select all text is not empty.
		 */
		if ( selectAllText ) {
			if ( ! event.detail?.selection ) {
				this.update();
			}
		} else {
			this.update();
		}
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

		// First clear the select all text.
		if ( multiSelect.getAttribute( 'select-all-text' ) === this.textContent ) {
			this.textContent = '';
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
