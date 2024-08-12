/**
 * Internal dependencies.
 */
import { TPLightboxElement } from './tp-lightbox';

/**
 * TP Lightbox Close.
 */
export class TPLightboxPreviousElement extends HTMLElement {
	/**
	 * Constructor.
	 */
	constructor() {
		// Initialize parent.
		super();

		// Events.
		this.querySelector( 'button' )?.addEventListener( 'click', this.previous.bind( this ) );
	}

	/**
	 * Navigate previous.
	 */
	previous(): void {
		// Check if we are disabled.
		if ( 'yes' === this.getAttribute( 'disabled' ) ) {
			// No we don't. Exit.
			return;
		}

		// Get lightbox.
		const lightbox: TPLightboxElement | null = this.closest( 'tp-lightbox' );

		// Check if we have a lightbox.
		if ( lightbox ) {
			setTimeout( (): void => {
				// Previous.
				lightbox.previous();
			}, 0 );
		}
	}
}
