import { TPLightboxGalleryElement } from './tp-lightbox-gallery';

/**
 * TP Lightbox Trigger
 */
export class TPLightboxTriggerElement extends HTMLElement {
	/**
	 * Properties
	 */
	private galleryID: string;
	private lightboxContentTemplate: HTMLTemplateElement | null;
	private slideIndex: number | undefined;

	/**
	 * Constructor
	 */
	constructor() {
		super();

		this.galleryID = '';
		this.lightboxContentTemplate = null;
	}

	/**
	 * Connected Callback
	 */
	connectedCallback(): void {
		// Initialize fields
		this.galleryID = this.getAttribute( 'gallery-id' ) ?? '';
		this.lightboxContentTemplate = this.querySelector( 'template' );

		// Check if there is a template for the content.
		if ( ! this.lightboxContentTemplate ) {
			return; // Not found, bail.
		}

		// Events
		this.addEventListener( 'click', this.handleClick.bind( this ) );
	}

	/**
	 * Event: Handles click event.
	 */
	handleClick() {
		let tpLightboxGallery = document.querySelector( `tp-lightbox-gallery[gallery-id="${ this.galleryID }"]` ) as TPLightboxGalleryElement;

		if ( ! tpLightboxGallery ) {
			tpLightboxGallery = this.initializeLightbox();
		}

		tpLightboxGallery.open( this.slideIndex );
	}

	/**
	 * Initializes the global TPLightboxElement
	 */
	private initializeLightbox(): TPLightboxGalleryElement {
		let tpLightbox = document.querySelector( 'tp-lightbox' );

		if ( ! tpLightbox ) {
			tpLightbox = document.createElement( 'tp-lightbox' );
			document.body.appendChild( tpLightbox );
		}

		const tpLightboxGallery = document.createElement( 'tp-lightbox-gallery' ) as TPLightboxGalleryElement;
		tpLightboxGallery.setAttribute( 'gallery-id', this.galleryID );
		tpLightbox.appendChild( tpLightboxGallery );

		if ( this.lightboxContentTemplate ) {
			this.slideIndex = tpLightboxGallery.addSlide( this.lightboxContentTemplate?.content.cloneNode( true ) as HTMLElement );
		}

		return tpLightboxGallery;
	}
}
