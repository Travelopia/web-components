/**
 * Internal dependencies.
 */
import { TPCarouselArrowElement } from './tp-carousel-arrow';
import { TPCarouselSlideElement } from './tp-carousel-slide';
import { TPCarouselSlidesElement } from './tp-carousel-slides';

/**
 * TP Carousel.
 */
export class TPCarouselElement extends HTMLElement {
	protected _observer: IntersectionObserver;
	protected slides: NodeListOf<TPCarouselSlideElement> | null;
	protected slideTrack: TPCarouselSlidesElement | null;
	protected isProgramaticScroll: boolean = false;

	/**
	 * Constructor.
	 */
	constructor() {
		// Initialize parent.
		super();
		this.slides = this.querySelectorAll( 'tp-carousel-slide' );
		this.slideTrack = this.querySelector( 'tp-carousel-slides' );
		this._observer = new IntersectionObserver( this.attributeChangeOnScroll?.bind( this ), { root: this.slideTrack, threshold: 1 } );

		// Set current slide.
		if ( ! this.getAttribute( 'current-slide' ) ) {
			this.setAttribute( 'current-slide', '1' );
		}

		// Initialize carousel.
		this.slide();
		this.setAttribute( 'initialized', 'yes' );

		// Observe which slide is in view.
		this.slides.forEach( ( slide ) => this._observer.observe( slide ) );
	}

	/**
	 * Connected callback.
	 */
	connectedCallback() {
		// Update on initial render.
		this.update();
	}

	/**
	 * Change current-slide attribute on scroll.
	 *
	 * @param {IntersectionObserverEntry[]} entries slides which enter or leave on scroll.
	 */
	attributeChangeOnScroll( entries: IntersectionObserverEntry[] ): void {
		// If the scroll is programatic.
		if ( this.isProgramaticScroll ) {
			// Do nothing.
			return;
		}

		// Change the current slide index when slide comes into view.
		entries?.forEach( ( entry ) => {
			// Check if the entry is intersecting with the slide track.
			if ( entry.isIntersecting && entry.target instanceof TPCarouselSlideElement && this.slides ) {
				const index = Array.from( this.slides ).indexOf( entry.target );

				// Update current slide index based on if it is is right or left scroll.
				if ( index + 1 - ( this.perView - 1 ) > this.currentSlideIndex ) {
					this.currentSlideIndex = index + 1 - ( this.perView - 1 );
				} else if ( index + 1 - ( this.perView - 1 ) < this.currentSlideIndex ) {
					this.currentSlideIndex = index + 1;
				}
			}
		} );
	}

	/**
	 * Get observed attributes.
	 *
	 * @return {Array} List of observed attributes.
	 */
	static get observedAttributes(): string[] {
		// Observed attributes.
		return [ 'current-slide', 'infinite', 'per-view' ];
	}

	/**
	 * Attribute changed callback.
	 *
	 * @param {string} name     Attribute name.
	 * @param {string} oldValue Old value.
	 * @param {string} newValue New value.
	 */
	attributeChangedCallback( name: string = '', oldValue: string = '', newValue: string = '' ): void {
		// Keep an eye on current slide.
		if ( 'current-slide' === name && oldValue !== newValue ) {
			this.slide();
			this.dispatchEvent( new CustomEvent( 'slide-complete', { bubbles: true } ) );
		}

		// Update the component after the attribute change.
		this.update();
	}

	/**
	 * Get current slide index.
	 *
	 * @return {number} Current slide index.
	 */
	get currentSlideIndex(): number {
		// To get the current slide index.
		return parseInt( this.getAttribute( 'current-slide' ) ?? '1' );
	}

	/**
	 * Set current slide index.
	 *
	 * @param {number} index Slide index.
	 */
	set currentSlideIndex( index: number ) {
		// Set the current slide index.
		this.setCurrentSlide( index );
	}

	/**
	 * Get per view.
	 *
	 * @return {number} Current step.
	 */
	get perView(): number {
		// To get number of slides per view.
		return parseInt( this.getAttribute( 'per-view' ) ?? '1' );
	}

	/**
	 * Set per view.
	 *
	 * @param {number} perView Per view.
	 */
	set perView( perView: number ) {
		// Set the number of slides per view.
		this.setAttribute( 'per-view', perView.toString() );
	}

	/**
	 * Get current step.
	 *
	 * @return {number} Current step.
	 */
	get step(): number {
		// To get the current step.
		return parseInt( this.getAttribute( 'step' ) ?? '1' );
	}

	/**
	 * Set current step.
	 *
	 * @param {number} step Step.
	 */
	set step( step: number ) {
		// Set the current step.
		this.setAttribute( 'step', step.toString() );
	}

	/**
	 * Get Slide Elements.
	 */
	getSlideElements() {
		// Get slides.
		const slidesElement: TPCarouselSlidesElement | null = this.querySelector( 'tp-carousel-slides' );
		const slides: NodeListOf<TPCarouselSlideElement> | null | undefined = slidesElement?.querySelectorAll( ':scope > tp-carousel-slide' );

		// Return array of slides.
		return slides;
	}

	/**
	 * Slide to the current slide.
	 *
	 * @protected
	 */
	protected slide(): void {
		// Check if carousel is disabled.
		if ( 'yes' === this.getAttribute( 'disabled' ) ) {
			// Yes, it is. So stop.
			return;
		}

		// Get slides.
		const slidesContainer: TPCarouselSlidesElement | null = this.querySelector( 'tp-carousel-slides' );
		const slides: NodeListOf<TPCarouselSlideElement> | null | undefined = this.getSlideElements();

		// Check if we have slide container and slides.
		if ( ! slidesContainer || ! slides ) {
			// No, we don't. Either one of them or both are missing. So stop.
			return;
		}

		// Check if behaviour is set to fade and slide on the current slide index is present in the slides array.
		if ( slides[ this.currentSlideIndex - 1 ] ) {
			// Yes, it is. So slide to the current slide.
			slidesContainer.scroll( {
				left: slides[ this.currentSlideIndex - 1 ].offsetLeft - slides[ 0 ].offsetLeft,
				behavior: 'smooth',
			} );
		}
	}

	/**
	 * Get the arrow element by selector.
	 *
	 * In case of nested carousels, it difficult to find the correct arrow
	 * because arrows can be placed anywhere.
	 * This function checks if the parent tp-carousel belongs to this component,
	 * then return that arrow element, using 'this'.
	 *
	 * @param {string} selector Selector.
	 */
	getArrow( selector: string ) {
		// Get all arrows.
		const arrows: NodeListOf<TPCarouselArrowElement> | null = this.querySelectorAll( selector );
		const parentCarouselElement: TPCarouselElement = this;
		let theArrow: TPCarouselArrowElement | null = this.querySelector( selector );

		// Loop through all the arrows including the one's inside nested carousel.
		arrows.forEach( ( arrow ) => {
			/**
			 * If the closest tp-carousel is the same as the parentCarouselElement, that means we have found
			 * the correct arrow.
			 */
			if ( parentCarouselElement === arrow.closest( 'tp-carousel' ) ) {
				theArrow = arrow;
			}
		} );

		// Return arrow.
		return theArrow;
	}

	/**
	 * Get current slide index.
	 *
	 * @return {number} Current slide index.
	 */
	getCurrentSlide(): number {
		// Get current slide index.
		return this.currentSlideIndex;
	}

	/**
	 * Update stuff when any attribute has changed.
	 * Example: Update sub-components.
	 */
	update(): void {
		// Get sub-components.
		const leftArrow: TPCarouselArrowElement | null = this.getArrow( 'tp-carousel-arrow[direction="previous"]' );
		const rightArrow: TPCarouselArrowElement | null = this.getArrow( 'tp-carousel-arrow[direction="next"]' );

		// Set active slide.
		const slides: NodeListOf<TPCarouselSlideElement> | null | undefined = this.getSlideElements();

		// Check if slides are available.
		if ( slides ) {
			slides.forEach( ( slide: TPCarouselSlideElement, index: number ): void => {
				// Update active attribute.
				if ( this.currentSlideIndex - 1 === index ) {
					slide.setAttribute( 'active', 'yes' );
				} else {
					slide.removeAttribute( 'active' );
				}
			} );
		}

		// Enable / disable arrows.
		if ( 'yes' !== this.getAttribute( 'infinite' ) ) {
			// For the last slide.
			if ( this.getCurrentSlide() === this.getTotalSlides() + 1 ) {
				rightArrow?.setAttribute( 'disabled', 'yes' );
			} else {
				rightArrow?.removeAttribute( 'disabled' );
			}

			// For the first slide.
			if ( 1 === this.getCurrentSlide() ) {
				leftArrow?.setAttribute( 'disabled', 'yes' );
			} else {
				leftArrow?.removeAttribute( 'disabled' );
			}
		}
	}

	/**
	 * Get total number of slides.
	 *
	 * @return {number} Total slides.
	 */
	getTotalSlides(): number {
		// To get the total number of slides.
		const slides: NodeListOf<TPCarouselSlideElement> | null | undefined = this.getSlideElements();

		// Check if slides are available.
		if ( slides ) {
			// Tell the total number of slides.
			return slides.length;
		}

		// Else return 0.
		return 0;
	}

	/**
	 * Set the current slide index.
	 *
	 * @param {number} index Slide index.
	 */
	setCurrentSlide( index: number ): void {
		// Check if slide index is valid.
		if ( index > this.getTotalSlides() || index <= 0 ) {
			// Stop! It's not valid.
			return;
		}

		// dispatch slide-set event.
		this.dispatchEvent(
			new CustomEvent( 'slide-set', {
				bubbles: true,
				detail: {
					slideIndex: index,
				},
			} ),
		);

		// Set current slide index.
		this.setAttribute( 'current-slide', index.toString() );
	}

	/**
	 * Navigate to the next slide.
	 */
	next(): void {
		// Flag that it is a programatic scroll.
		this.flagProgramaticScroll();

		// Initialize total slides variable.
		const totalSlides: number = this.getTotalSlides();

		// Check if we are at the last slide considering per view attribute.
		if ( this.currentSlideIndex >= totalSlides - this.perView + 1 ) {
			// Check if we are in infinite mode.
			if ( 'yes' === this.getAttribute( 'infinite' ) ) {
				// Yes, we are, and go back to first slide.
				this.setCurrentSlide( 1 );
			}

			// Terminate.
			return;
		}

		// Get next slide index by adding minimum of step or remaining number of slides.
		const nextSlideIndex: number = this.currentSlideIndex + Math.min( this.step, totalSlides - this.currentSlideIndex - this.perView + 1 );

		// Check if the next slide step is not taking it beyond the last slide.
		if ( nextSlideIndex > ( totalSlides - this.perView + 1 ) ) {
			// Yes, it is.
			return;
		}

		// Everything is good, go to next slide.
		this.setCurrentSlide( nextSlideIndex );
	}

	/**
	 * Navigate to the previous slide.
	 */
	previous(): void {
		// Flag that it is a programatic scroll.
		this.flagProgramaticScroll();

		// Check if we are at the first slide.
		if ( this.currentSlideIndex <= 1 ) {
			// Check if we are in infinite mode.
			if ( 'yes' === this.getAttribute( 'infinite' ) ) {
				this.setCurrentSlide( this.getTotalSlides() - this.perView + 1 );
			}

			// Terminate.
			return;
		}

		// Get previous slide index.
		const previousSlideNumber: number = this.currentSlideIndex;

		// Check if the previous slide step is not taking it beyond the first slide.
		if ( previousSlideNumber > this.step ) {
			this.setCurrentSlide( previousSlideNumber - this.step );
		} else {
			this.setCurrentSlide( 1 );
		}
	}

	/**
	 * To set a flag if it is a programatic scroll.
	 */
	flagProgramaticScroll() {
		// Set the flag to true.
		this.isProgramaticScroll = true;

		// Set the flag to false after 500ms.
		setTimeout( () => {
			// Set the flag to false.
			this.isProgramaticScroll = false;
		}, 500 );
	}
}
