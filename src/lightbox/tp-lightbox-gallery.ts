/**
 * TP Lightbox Gallery
 */
export class TPLightboxGalleryElement extends HTMLElement {
	/**
	 * Properties
	 */
	private galleryID: string;
	private numSlides: number;
	private currentSlide: number;

	/**
	 * Constructor
	 */
	constructor() {
		super();

		this.galleryID = this.getAttribute( 'gallery-id' ) ?? '';
		this.numSlides = 0;
		this.currentSlide = 0;
	}

	/**
	 * Connected callback
	 */
	connectedCallback() {
		const innerElements = [
			document.createElement( 'tp-lightbox-counter' ),
			document.createElement( 'tp-lightbox-close' ),
			document.createElement( 'tp-lightbox-slider' ),
		];

		if ( '' !== this.galleryID ) {
			const prevBtn = document.createElement( 'tp-lightbox-nav-button' );
			const nextBtn = document.createElement( 'tp-lightbox-nav-button' );
			prevBtn.setAttribute( 'direction', 'prev' );
			nextBtn.setAttribute( 'direction', 'next' );

			innerElements.push( prevBtn, nextBtn );
		}

		innerElements.forEach( ( innerElement ) => this.appendChild( innerElement ) );
	}

	/**
	 * Adds slide
	 *
	 * @param { HTMLElement } slideContent
	 */
	addSlide( slideContent: HTMLElement ): number | undefined {
		if ( ! slideContent ) {
			return undefined;
		}

		const slideElement = document.createElement( 'tp-lightbox-slide' );
		slideElement.appendChild( slideContent );

		this.querySelector( 'tp-lightbox-slider' )?.appendChild( slideElement );

		this.numSlides++;

		return this.numSlides;
	}

	// Open the lightbox gallery.
	open( slideIndex: number | undefined ) {
		if ( ! slideIndex ) {
			return;
		}

		this.currentSlide = slideIndex;
		this.setAttribute( 'current-slide', this.currentSlide.toString() );
		this.setAttribute( 'open', '' );
	}

	// Close the lightbox gallery.
	close() {
		this.removeAttribute( 'open' );
	}
}
