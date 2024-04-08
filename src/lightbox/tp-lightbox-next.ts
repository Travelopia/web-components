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
		super();

		// Events.
		this.querySelector( 'button' )?.addEventListener( 'click', this.next.bind( this ) );
	}

	/**
	 * Navigate next.
	 */
	next(): void {
		if ( 'yes' === this.getAttribute( 'disabled' ) ) {
			return;
		}

		const lightbox: TPLightboxElement | null = this.closest( 'tp-lightbox' );
		if ( lightbox ) {
			setTimeout( (): void => {
				lightbox.next();
			}, 0 );
		}
	}
}
