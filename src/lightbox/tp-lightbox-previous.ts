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
		super();

		// Events.
		this.querySelector( 'button' )?.addEventListener( 'click', this.previous.bind( this ) );
	}

	/**
	 * Navigate previous.
	 */
	previous(): void {
		if ( 'yes' === this.getAttribute( 'disabled' ) ) {
			return;
		}

		const lightbox: TPLightboxElement | null = this.closest( 'tp-lightbox' );
		if ( lightbox ) {
			setTimeout( (): void => {
				lightbox.previous();
			}, 0 );
		}
	}
}
