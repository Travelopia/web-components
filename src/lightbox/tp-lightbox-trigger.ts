import { TPLightboxGalleryElement } from './tp-lightbox-gallery';

/**
 * TP Lightbox Trigger
 */
export class TPLightboxTriggerElement extends HTMLElement {
	/**
	 * Properties
	 */
	private galleryID: string | null;
	private slideIndex: number | undefined;
	lightboxContentTemplate: HTMLTemplateElement | null;

	/**
	 * Constructor
	 */
	constructor() {
		super();

		this.galleryID = null;
		this.lightboxContentTemplate = null;
	}

	/**
	 * Get observed attributes.
	 *
	 * @return {Array} List of observed attributes.
	 */
	static get observedAttributes(): string[] {
		return [ 'slide-index' ];
	}

	/**
	 * Attribute changed callback.
	 *
	 * @param {string} name     Attribute name.
	 * @param {string} oldValue Old value.
	 * @param {string} newValue New value.
	 */
	attributeChangedCallback( name: string = '', oldValue: string = '', newValue: string = '' ): void {
		if ( 'slide-index' === name && oldValue !== newValue && '' !== newValue ) {
			this.slideIndex = Number( newValue );
		}
	}

	/**
	 * Connected Callback
	 */
	connectedCallback(): void {
		// Initialize fields
		this.galleryID = this.getAttribute( 'gallery-id' );
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
		let galleryQuery = 'tp-lightbox-gallery';

		if ( ! this.galleryID ) {
			galleryQuery += ':not([gallery-id])';
		} else {
			galleryQuery += `[gallery-id="${ this.galleryID }"]`;
		}

		let tpLightboxGallery = document.querySelector( galleryQuery ) as TPLightboxGalleryElement;

		if ( ! tpLightboxGallery ) {
			tpLightboxGallery = this.initializeLightbox();

			const slideIndexAttribute = this.getAttribute( 'slide-index' );

			if ( slideIndexAttribute ) {
				this.slideIndex = Number( slideIndexAttribute );
			}
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

		// There is no gallery id, put it in the default one.
		if ( this.galleryID ) {
			tpLightboxGallery.setAttribute( 'gallery-id', this.galleryID );
		}

		tpLightbox.appendChild( tpLightboxGallery );

		return tpLightboxGallery;
	}
}
