/**
 * Internal dependencies.
 */
import { TPPhoneInputElement } from './tp-phone-input';

/**
 * TP Phone Input Countries.
 */
export class TPPhoneInputCountriesElement extends HTMLElement {
	/**
	 * Properties.
	 */
	protected readonly button: HTMLButtonElement | null;

	/**
	 * Constructor.
	 */
	constructor() {
		// Initialize parent.
		super();

		// Elements.
		this.button = this.querySelector( ':scope > button' );

		// Events.
		this.button?.addEventListener( 'click', this.toggle.bind( this ) );
		document.addEventListener( 'click', this.handleDocumentClick.bind( this ) );
	}

	/**
	 * Toggle component.
	 */
	toggle(): void {
		// Get parent input.
		const input: TPPhoneInputElement | null = this.closest( 'tp-phone-input' );

		// Update its attribute.
		if ( 'yes' === this.getAttribute( 'open' ) ) {
			input?.removeAttribute( 'open' );
		} else {
			input?.setAttribute( 'open', 'yes' );
		}
	}

	/**
	 * Handle document click.
	 *
	 * @param {Event} e Click event.
	 */
	protected handleDocumentClick( e: Event ): void {
		// Close on click outside.
		if ( this !== e.target && ! this.contains( e.target as Node ) ) {
			const input: TPPhoneInputElement | null = this.closest( 'tp-phone-input' );
			input?.removeAttribute( 'open' );
		}
	}
}
