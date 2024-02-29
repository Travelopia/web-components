import { TPLightboxGalleryElement } from './tp-lightbox-gallery';
import { TPLightboxTriggerElement } from './tp-lightbox-trigger';

/**
 * TP Lightbox Slider
 */
export class TPLightboxSliderElement extends HTMLElement {
	/**
	 * Connected callback
	 */
	connectedCallback() {
		const gallery = this.closest( 'tp-lightbox-gallery' ) as TPLightboxGalleryElement;

		if ( ! gallery ) {
			return;
		}

		const galleryID = gallery.getAttribute( 'gallery-id' );

		let triggerQuery = 'tp-lightbox-trigger';

		if ( ! galleryID ) {
			triggerQuery += ':not([gallery-id])';
		} else {
			triggerQuery += `[gallery-id="${ galleryID }"]`;
		}

		const triggers = Array.from( document.querySelectorAll<TPLightboxTriggerElement>( triggerQuery ) );

		triggers.forEach( ( trigger ) => {
			const slideIndex = gallery.addSlide( trigger.lightboxContentTemplate?.content.cloneNode( true ) as HTMLElement );

			if ( slideIndex ) {
				trigger.setAttribute( 'slide-index', slideIndex.toString() );
			}
		} );
	}
}
