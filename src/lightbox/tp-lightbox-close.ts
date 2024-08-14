/**
 * Internal dependencies.
 */
import { TPLightboxElement } from './tp-lightbox';

/**
 * TP Lightbox Close.
 */
export class TPLightboxCloseElement extends HTMLElement {
	/**
	 * Constructor.
	 */
	constructor() {
		// Initialize parent.
		super();

		// Events.
		this.querySelector( 'button' )?.addEventListener( 'click', this.close.bind( this ) );
	}

	/**
	 * Close the lightbox.
	 */
	close(): void {
		// Get lightbox.
		const lightbox: TPLightboxElement | null = this.closest( 'tp-lightbox' );

		// Check if we have a lightbox.
		if ( lightbox ) {
			setTimeout( (): void => {
				// Close the lightbox.
				lightbox.close();
			}, 0 );
		}
	}
}
