/**
 * Internal dependencies.
 */
import { TPLightboxElement } from './tp-lightbox';

/**
 * TP Lightbox Close.
 */
export class TPLightboxNextElement extends HTMLElement {
	/**
	 * Constructor.
	 */
	constructor() {
		// Initialize parent.
		super();

		// Events.
		this.querySelector( 'button' )?.addEventListener( 'click', this.next.bind( this ) );
	}

	/**
	 * Navigate next.
	 */
	next(): void {
		// Check if next is disabled.
		if ( 'yes' === this.getAttribute( 'disabled' ) ) {
			// Yes it is. Exit.
			return;
		}

		// Get lightbox.
		const lightbox: TPLightboxElement | null = this.closest( 'tp-lightbox' );

		// Check if we have a lightbox.
		if ( lightbox ) {
			setTimeout( (): void => {
				// Initiate next.
				lightbox.next();
			}, 0 );
		}
	}
}
