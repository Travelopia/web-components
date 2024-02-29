/**
 * TP Lightbox Gallery
 */
export class TPLightboxGalleryElement extends HTMLElement {
	/**
	 * Properties
	 */
	private galleryID: string | null;
	private numSlides: number;
	private currentSlide: number;

	/**
	 * Constructor
	 */
	constructor() {
		super();

		this.galleryID = this.getAttribute( 'gallery-id' );
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

		if ( null !== this.galleryID ) {
			const prevBtn = document.createElement( 'tp-lightbox-nav-button' );
			const nextBtn = document.createElement( 'tp-lightbox-nav-button' );
			prevBtn.setAttribute( 'direction', 'prev' );
			nextBtn.setAttribute( 'direction', 'next' );

			innerElements.push( prevBtn, nextBtn );
		}

		innerElements.forEach( ( innerElement ) => this.appendChild( innerElement ) );

		this.addEventListener( 'click', this.handleClick.bind( this ) );
	}

	/**
	 * Adds slide
	 *
	 * @param { HTMLElement | undefined } slideContent
	 */
	addSlide( slideContent: HTMLElement | undefined ): number | undefined {
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
		this.dispatchEvent( new CustomEvent( 'open', { bubbles: false } ) );
	}

	// Close the lightbox gallery.
	close() {
		this.removeAttribute( 'open' );
		this.dispatchEvent( new CustomEvent( 'close', { bubbles: false } ) );
	}

	handleClick( e: Event ) {
		if ( e.target === this ) {
			this.close();
		}
	}
}
