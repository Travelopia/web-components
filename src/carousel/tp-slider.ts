/**
 * Internal dependencies.
 */
import { TPSliderSlidesElement } from './tp-slider-slides';
import { TPSliderSlideElement } from './tp-slider-slide';
// import { TPSliderArrowElement } from './tp-slider-arrow';

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
		if ( ! slidesElement ) {
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

		if ( 'yes' === this.getAttribute( 'infinite' ) ) {
			console.log("In");
			slidesElement.scrollLeft += 800;
			if (slidesElement.scrollLeft >= (totalSlides - 1) * slidesElement.offsetWidth) {
				slidesElement.scrollLeft = 0;
			}
		} else {
			slidesElement.scrollLeft += slidesElement.offsetWidth;
			if (slidesElement.scrollLeft > (totalSlides - 1) * slidesElement.offsetWidth){
				slidesElement.scrollLeft = (totalSlides - 1) * slidesElement.offsetWidth;
			}
		}
	}

	/**
	 * Navigate to the previous slide.
	 */
	previous(): void {
	// Check if we are at the first slide.
	if ( this.currentSlideIndex <= 1 ) {
		// Check if we are in infinite mode.
		if ( 'yes' === this.getAttribute( 'infinite' ) ) {
			this.setCurrentSlide( this.getTotalSlides() );
		}

		// Terminate.
		return;
	}
		// Get previous slide index.
		const previousSlideNumber: number = this.currentSlideIndex - 1;

		// Check if the previous slide step is not taking it beyond the first slide.
		if ( previousSlideNumber > 1 ) {
			this.setCurrentSlide( previousSlideNumber );
		} else {
			this.setCurrentSlide( 1 );
		}

		// Initialize total slides variable.
		const totalSlides: number = this.getTotalSlides();

		// Get slides and slide.
		const slidesElement: TPSliderSlidesElement | null = this.querySelector( 'tp-slider-slides' );

		// Bail.
		if ( ! slidesElement ) {
			// Early return.
			 return;
		}

		if (totalSlides) {
			slidesElement.scrollLeft -= slidesElement.offsetWidth;
			if (slidesElement.scrollLeft <= 0) {
				slidesElement.scrollLeft = (totalSlides - 1) * slidesElement.offsetWidth;
			}
		} else {
			slidesElement.scrollLeft -= slidesElement.offsetWidth;
			if (slidesElement.scrollLeft < 0){
				slidesElement.scrollLeft = 0;
			}
		}
	}


	/**
	 * Update Slides.
	 */
	updateSlide(): void {
	// Check if slider is disabled.
	if ( 'yes' === this.getAttribute( 'disabled' ) ) {
		// Yes, it is. So stop.
		return;
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

