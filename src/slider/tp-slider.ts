/**
 * Internal dependencies.
 */
import { TPSliderSlidesElement } from './tp-slider-slides';
import { TPSliderSlideElement } from './tp-slider-slide';
import { TPSliderCountElement } from './tp-slider-count';
import { TPSliderNavItemElement } from './tp-slider-nav-item';
import { TPSliderArrowElement } from './tp-slider-arrow';

/**
 * TP Slider.
 */
export class TPSliderElement extends HTMLElement {
	/**
	 * Constructor.
	 */
	constructor() {
		super();

		// Set current slide.
		if ( ! this.getAttribute( 'current-slide' ) ) {
			this.setAttribute( 'current-slide', '1' );
		}

		// Initialize slider.
		this.slide();
		this.setAttribute( 'initialized', 'yes' );

		// Event listeners.
		window.addEventListener( 'resize', this.handleResize.bind( this ) );
	}

	/**
	 * Get observed attributes.
	 *
	 * @return {Array} List of observed attributes.
	 */
	static get observedAttributes(): string[] {
		return [ 'current-slide', 'flexible-height', 'infinite' ];
	}

	/**
	 * Attribute changed callback.
	 *
	 * @param {string} name     Attribute name.
	 * @param {string} oldValue Old value.
	 * @param {string} newValue New value.
	 */
	attributeChangedCallback( name: string = '', oldValue: string = '', newValue: string = '' ): void {
		if ( 'current-slide' === name && oldValue !== newValue ) {
			this.slide();
			this.dispatchEvent( new CustomEvent( 'slide-complete', { bubbles: true } ) );
		}

		this.update();
	}

	/**
	 * Get current slide index.
	 *
	 * @return {number} Current slide index.
	 */
	get currentSlideIndex(): number {
		return parseInt( this.getAttribute( 'current-slide' ) ?? '1' );
	}

	/**
	 * Set current slide index.
	 *
	 * @param {number} index Slide index.
	 */
	set currentSlideIndex( index: number ) {
		this.setCurrentSlide( index );
	}

	/**
	 * Get total number of slides.
	 *
	 * @return {number} Total slides.
	 */
	getTotalSlides(): number {
		const slides: NodeListOf<TPSliderSlideElement> | null = this.querySelectorAll( 'tp-slider-slide' );
		if ( slides ) {
			return slides.length;
		}

		return 0;
	}

	/**
	 * Navigate to the next slide.
	 */
	next(): void {
		const totalSlides: number = this.getTotalSlides();

		if ( this.currentSlideIndex >= totalSlides ) {
			if ( 'yes' === this.getAttribute( 'infinite' ) ) {
				this.setCurrentSlide( 1 );
			}

			return;
		}

		this.setCurrentSlide( this.currentSlideIndex + 1 );
	}

	/**
	 * Navigate to the previous slide.
	 */
	previous(): void {
		if ( this.currentSlideIndex <= 1 ) {
			if ( 'yes' === this.getAttribute( 'infinite' ) ) {
				this.setCurrentSlide( this.getTotalSlides() );
			}

			return;
		}

		this.setCurrentSlide( this.currentSlideIndex - 1 );
	}

	/**
	 * Get current slide index.
	 *
	 * @return {number} Current slide index.
	 */
	getCurrentSlide(): number {
		return this.currentSlideIndex;
	}

	/**
	 * Set the current slide index.
	 *
	 * @param {number} index Slide index.
	 */
	setCurrentSlide( index: number ): void {
		if ( index > this.getTotalSlides() || index <= 0 ) {
			return;
		}

		this.dispatchEvent( new CustomEvent( 'slide-set', { bubbles: true } ) );
		this.setAttribute( 'current-slide', index.toString() );
	}

	/**
	 * Slide to the current slide.
	 *
	 * @protected
	 */
	protected slide(): void {
		// Check if slider is disabled.
		if ( 'yes' === this.getAttribute( 'disabled' ) ) {
			return;
		}

		// Get slides.
		const slidesContainer: TPSliderSlidesElement | null = this.querySelector( 'tp-slider-slides' );
		const slides: NodeListOf<TPSliderSlideElement> | null = this.querySelectorAll( 'tp-slider-slide' );
		if ( ! slidesContainer || ! slides ) {
			return;
		}

		// First, update the height.
		this.updateHeight();

		// Now lets slide!
		slidesContainer.style.left = `-${ this.offsetWidth * ( this.currentSlideIndex - 1 ) }px`;
	}

	/**
	 * Update stuff when any attribute has changed.
	 * Example: Update subcomponents.
	 */
	update(): void {
		// Get subcomponents.
		const sliderNavItems: NodeListOf<TPSliderNavItemElement> | null = this.querySelectorAll( 'tp-slider-nav-item' );
		const sliderCount: TPSliderCountElement | null = this.querySelector( 'tp-slider-count' );
		const leftArrow: TPSliderArrowElement | null = this.querySelector( 'tp-slider-arrow[direction="previous"]' );
		const rightArrow: TPSliderArrowElement | null = this.querySelector( 'tp-slider-arrow[direction="next"]' );

		// Set active slide.
		const slides: NodeListOf<TPSliderSlideElement> | null = this.querySelectorAll( 'tp-slider-slide' );
		slides?.forEach( ( slide: TPSliderSlideElement, index: number ): void => {
			if ( this.currentSlideIndex - 1 === index ) {
				slide.setAttribute( 'active', 'yes' );
			} else {
				slide.removeAttribute( 'active' );
			}
		} );

		// Set current slider nav item.
		if ( sliderNavItems ) {
			sliderNavItems.forEach( ( navItem: TPSliderNavItemElement, index: number ): void => {
				if ( this.currentSlideIndex - 1 === index ) {
					navItem.setAttribute( 'current', 'yes' );
				} else {
					navItem.removeAttribute( 'current' );
				}
			} );
		}

		// Update slider count.
		if ( sliderCount ) {
			sliderCount.setAttribute( 'current', this.getCurrentSlide().toString() );
			sliderCount.setAttribute( 'total', this.getTotalSlides().toString() );
		}

		// Enable / disable arrows.
		if ( 'yes' !== this.getAttribute( 'infinite' ) ) {
			if ( this.getCurrentSlide() === this.getTotalSlides() ) {
				rightArrow?.setAttribute( 'disabled', 'yes' );
			} else {
				rightArrow?.removeAttribute( 'disabled' );
			}

			if ( 1 === this.getCurrentSlide() ) {
				leftArrow?.setAttribute( 'disabled', 'yes' );
			} else {
				leftArrow?.removeAttribute( 'disabled' );
			}
		} else {
			rightArrow?.removeAttribute( 'disabled' );
			leftArrow?.removeAttribute( 'disabled' );
		}
	}

	/**
	 * Update the height of the slider based on current slide.
	 */
	updateHeight(): void {
		// Get slides container to resize.
		const slidesContainer: TPSliderSlidesElement | null = this.querySelector( 'tp-slider-slides' );
		if ( ! slidesContainer ) {
			return;
		}

		// Bail early if we don't want it to be flexible height.
		if ( 'yes' !== this.getAttribute( 'flexible-height' ) ) {
			// Remove height property for good measure!
			slidesContainer.style.removeProperty( 'height' );
			return;
		}

		// Get slides.
		const slides: NodeListOf<TPSliderSlideElement> | null = this.querySelectorAll( 'tp-slider-slide' );
		if ( ! slides ) {
			return;
		}

		// Set the height of the container to be the height of the current slide.
		const height: number = slides[ this.currentSlideIndex - 1 ].scrollHeight;
		slidesContainer.style.height = `${ height }px`;
	}

	/**
	 * Resize the slider when the window is resized.
	 *
	 * @protected
	 */
	protected handleResize(): void {
		// First, lets flag this component as resizing.
		this.setAttribute( 'resizing', 'yes' );

		// Run the slide (so height can be resized).
		this.slide();

		// Done, let's remove the flag.
		// We need to do this on a timeout to avoid a race condition with transitions.
		const _this = this;
		setTimeout( function() {
			_this.removeAttribute( 'resizing' );
		}, 10 );
	}
}
