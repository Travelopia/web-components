/**
 * Internal dependencies.
 */
import { TPSliderSlidesElement } from './tp-slider-slides';
import { TPSliderSlideElement } from './tp-slider-slide';

/**
 * TP Slider.
 */
export class TPSliderElement extends HTMLElement {
	/**
	 * Constructor.
	 */
	constructor() {
		// Initialize parent.
		super();

		// Set current slide.
		if ( ! this.getAttribute( 'current-slide' ) ) {
			this.setAttribute( 'current-slide', '1' );
		}

		// Initialize slider.
		this.setAttribute( 'initialized', 'yes' );
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
	 * Get total number of slides.
	 *
	 * @return {number} Total slides.
	 */
	getTotalSlides(): number {
		// To get the total number of slides.
		const slides: NodeListOf<TPSliderSlideElement> | null | undefined = this.getSlideElements();

		// Check if slides are available.
		if ( slides ) {
			// Tell the total number of slides.
			return slides.length;
		}

		// Else return 0.
		return 0;
	}

	/**
	 * Get Slide Elements.
	 */
	getSlideElements() {
		// Get slides.
		const slidesElement: TPSliderSlidesElement | null = this.querySelector( 'tp-slider-slides' );
		const slides: NodeListOf<TPSliderSlideElement> | null | undefined = slidesElement?.querySelectorAll( ':scope > tp-slider-slide' );

		// Return array of slides.
		return slides;
	}

	/**
	 * Navigate to the next slide.
	 */
	next(): void {
		// Initialize total slides variable.
		const totalSlides: number = this.getTotalSlides();

		// Get slides and slide.
		const slidesElement: TPSliderSlidesElement | null = this.querySelector( 'tp-slider-slides' );

		// Bail.
		if ( ! slidesElement || ! totalSlides ) {
			// Early return.
			return;
		}

		// Check if we are at the last slide considering per view attribute.
		if ( this.currentSlideIndex >= totalSlides ) {
			// Check if we are in infinite mode.
			if ( 'yes' === this.getAttribute( 'infinite' ) ) {
				// Yes, we are, and go back to first slide.
				this.setCurrentSlide( 1 );
			}

			// Terminate.
			return;
		}

		// Get next slide index by adding minimum of step or remaining number of slides.
		const nextSlideIndex: number = this.currentSlideIndex + 1;

		// Check if the next slide step is not taking it beyond the last slide.
		if ( nextSlideIndex > totalSlides ) {
			// Yes, it is.
			return;
		}

		// Everything is good, go to next slide.
		this.setCurrentSlide( nextSlideIndex );

		// Checlk if infinite slide and swipe the slide.
		if ( 'yes' === this.getAttribute( 'infinite' ) ) {
			slidesElement.scrollLeft += slidesElement.offsetWidth;

			// If slides Element have reached it's last point.
			if ( slidesElement.scrollLeft >= ( totalSlides - 1 ) * slidesElement.offsetWidth ) {
				// Set position to initial.
				slidesElement.scrollLeft = 0;
			}
		} else {
			// Set next slide.
			slidesElement.scrollLeft += slidesElement.offsetWidth;

			// Check if at the last slide.
			if ( slidesElement.scrollLeft > ( totalSlides - 1 ) * slidesElement.offsetWidth ) {
				// Set and stay at last slide.
				slidesElement.scrollLeft = ( totalSlides - 1 ) * slidesElement.offsetWidth;
			}
		}
	}

	/**
	 * Navigate to the previous slide.
	 */
	previous(): void {
		// Initialize total slides variable.
		const totalSlides: number = this.getTotalSlides();

		// Get slides and slide.
		const slidesElement: TPSliderSlidesElement | null = this.querySelector( 'tp-slider-slides' );

		// Bail.
		if ( ! slidesElement || ! totalSlides ) {
			// Early return.
			return;
		}

		// Check if we are at the first slide.
		if ( this.currentSlideIndex <= 1 ) {
			// Check if we are in infinite mode.
			if ( 'yes' === this.getAttribute( 'infinite' ) ) {
				// set last slide.
				this.setCurrentSlide( this.getTotalSlides() );
			}

			// Terminate.
			return;
		}

		// Get previous slide index.
		const previousSlideNumber: number = this.currentSlideIndex - 1;

		// Check if the previous slide step is not taking it beyond the first slide.
		if ( previousSlideNumber > 1 ) {
			// Set to previous slide.
			this.setCurrentSlide( previousSlideNumber );
		} else {
			// Set at first slide.
			this.setCurrentSlide( 1 );
		}

		// Checlk if infinite slide and swipe the slide.
		if ( totalSlides ) {
			// Set previous slide.
			slidesElement.scrollLeft -= slidesElement.offsetWidth;

			// Checking if container posization is at initial.
			if ( slidesElement.scrollLeft <= 0 ) {
				// Set last slide.
				slidesElement.scrollLeft = ( totalSlides - 1 ) * slidesElement.offsetWidth;
			}
		} else {
			// Set previous slide.
			slidesElement.scrollLeft -= slidesElement.offsetWidth;

			// Checking if container posization is at initial.
			if ( slidesElement.scrollLeft < 0 ) {
				// Set and stay at initial slide.
				slidesElement.scrollLeft = 0;
			}
		}
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
		this.dispatchEvent( new CustomEvent( 'slide-set', {
			bubbles: true,
			detail: {
				slideIndex: index,
			},
		} ) );

		// Set current slide index.
		this.setAttribute( 'current-slide', index.toString() );
	}
}
