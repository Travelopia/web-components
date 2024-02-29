import { TPLightboxGalleryElement } from './tp-lightbox-gallery';

/**
 * TP Lightbox Close
 */
export class TPLightboxCloseElement extends HTMLElement {
	/**
	 * Connected Callback
	 */
	connectedCallback() {
		this.addEventListener( 'click', this.handleClick.bind( this ) );
	}

	/**
	 * Handle Click
	 */
	handleClick() {
		this.closest<TPLightboxGalleryElement>( 'tp-lightbox-gallery' )?.close();
	}
}
