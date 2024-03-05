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
	 * Properties.
	 */
	protected touchStartX: number = 0;

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
		this.autoSlide();
		this.setAttribute( 'initialized', 'yes' );

		// Event listeners.
		if ( ! ( 'ResizeObserver' in window ) ) {
			// We set the resize observer in `tp-slider-slide`
			// These are just fallbacks for browsers that don't support ResizeObserver.
			// @ts-ignore
			window.addEventListener( 'resize', this.handleResize.bind( this ) );
			document.fonts.ready.then( () => this.handleResize() );
		}

		this.addEventListener( 'touchstart', this.handleTouchStart.bind( this ) );
		this.addEventListener( 'touchend', this.handleTouchEnd.bind( this ) );
	}

	/**
	 * Connected callback.
	 */
	connectedCallback() {
		/**
		 * Update on initial render.
		 *
		 * This is so that the disabled values of the navigation arrows
		 * can be set because attributeChangedCallback does not get fired when
		 * no attributes are passed to the slider.
		 */
		this.update();
	}

	/**
	 * Get observed attributes.
	 *
	 * @return {Array} List of observed attributes.
	 */
	static get observedAttributes(): string[] {
		return [ 'current-slide', 'flexible-height', 'infinite', 'swipe' ];
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
		const slides: NodeListOf<TPSliderSlideElement> | null | undefined = this.getSlideElements();

		if ( slides ) {
			return slides.length;
		}

		return 0;
	}

	/**
	 * Get Slide Elements.
	 */
	getSlideElements() {
		const slidesElement: TPSliderSlidesElement | null = this.querySelector( 'tp-slider-slides' );
		const slides: NodeListOf<TPSliderSlideElement> | null | undefined = slidesElement?.querySelectorAll( ':scope > tp-slider-slide' );

		return slides;
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

		this.dispatchEvent( new CustomEvent( 'slide-set', {
			bubbles: true,
			detail: {
				slideIndex: index,
			},
		} ) );
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
		const slides: NodeListOf<TPSliderSlideElement> | null | undefined = this.getSlideElements();
		if ( ! slidesContainer || ! slides ) {
			return;
		}

		// First, update the height.
		this.updateHeight();

		// Get slides per view.
		const slidesPerView: number = parseInt( this.getAttribute( 'slides-per-view' ) ?? '1' );
		const tpSliderArrowButtons = this.querySelectorAll( 'tp-slider-arrow' );

		// If we have more than 1 slide per view, we need to handle the arrow buttons.
		if ( slidesPerView > 1 ) {
			tpSliderArrowButtons.forEach( ( arrowButton ) => {
				// Handle first/last slide button clicks to avoid white space slides.
				arrowButton.addEventListener( 'click', () => {
					// Current Slide Number.
					const currentSlideNumber = this.getCurrentSlide() ?? 0;
					const lastSlideNumber = this.getTotalSlides() - slidesPerView + 1;

					// Check the direction of the button clicked.
					const direction = arrowButton?.getAttribute( 'direction' );

					// If user clicked next at the end of the last visible slide.
					if ( 'next' === direction && lastSlideNumber < currentSlideNumber ) {
						// Redirect the slider to first slide.
						this.setCurrentSlide( 1 );
					} else if ( 'previous' === direction && lastSlideNumber < currentSlideNumber ) {
						// If user clicked previous at the first slide, redirect it to last visible slide.
						this.setCurrentSlide( lastSlideNumber );
					}
				} );
			} );
		}

		// Now lets slide!
		const behaviour: string = this.getAttribute( 'behaviour' ) || '';
		if ( 'fade' !== behaviour && slides[ this.currentSlideIndex - 1 ] ) {
			slidesContainer.style.left = `-${ slides[ this.currentSlideIndex - 1 ].offsetLeft }px`;
		}
	}

	/**
	 * Get the arrow element by selector.
	 *
	 * In case of nested sliders, it difficult to find the correct arrow
	 * because arrows can be placed anywhere.
	 * This function checks if the parent tp-slider belongs to this component,
	 * then return that arrow element, using 'this'.
	 *
	 * @param {string} selector Selector.
	 */
	getArrow( selector: string ) {
		// Get all arrows.
		const arrows: NodeListOf<TPSliderArrowElement> | null = this.querySelectorAll( selector );
		const parentSliderElement: TPSliderElement = this;
		let theArrow: TPSliderArrowElement | null = this.querySelector( selector );

		// Loop through all the arrows including the one's inside nested slider.
		arrows.forEach( ( arrow ) => {
			/**
			 * If the closest tp-slider is the same as the parentSliderElement, that means we have found
			 * the correct arrow.
			 */
			if ( parentSliderElement === arrow.closest( 'tp-slider' ) ) {
				theArrow = arrow;
			}
		} );

		// Return arrow.
		return theArrow;
	}

	/**
	 * Update stuff when any attribute has changed.
	 * Example: Update subcomponents.
	 */
	update(): void {
		// Get subcomponents.
		const sliderNavItems: NodeListOf<TPSliderNavItemElement> | null = this.querySelectorAll( 'tp-slider-nav-item' );
		const sliderCounts: NodeListOf<TPSliderCountElement> | null = this.querySelectorAll( 'tp-slider-count' );
		const leftArrow: TPSliderArrowElement | null = this.getArrow( 'tp-slider-arrow[direction="previous"]' );
		const rightArrow: TPSliderArrowElement | null = this.getArrow( 'tp-slider-arrow[direction="next"]' );

		// Set active slide.
		const slides: NodeListOf<TPSliderSlideElement> | null | undefined = this.getSlideElements();

		// Check if slides are available.
		if ( slides ) {
			slides.forEach( ( slide: TPSliderSlideElement, index: number ): void => {
				if ( this.currentSlideIndex - 1 === index ) {
					slide.setAttribute( 'active', 'yes' );
				} else {
					slide.removeAttribute( 'active' );
				}
			} );
		}

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
		if ( sliderCounts ) {
			// Set total attribute.
			this.setAttribute( 'total', this.getTotalSlides().toString() );

			// Update slider counts.
			sliderCounts.forEach( ( slideCount: TPSliderCountElement ) => {
				slideCount.update();
			} );
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

		// Bail early if we don't want it to be flexible height - as long as it doesn't fade.
		if ( 'yes' !== this.getAttribute( 'flexible-height' ) && 'fade' !== this.getAttribute( 'behaviour' ) ) {
			// Remove height property for good measure!
			slidesContainer.style.removeProperty( 'height' );
			return;
		}

		// Get slides.
		const slides: NodeListOf<TPSliderSlideElement> | null | undefined = this.getSlideElements();
		if ( ! slides ) {
			return;
		}

		// Check if we have a flexible height.
		if ( 'yes' === this.getAttribute( 'flexible-height' ) ) {
			// Set the height of the container to be the height of the current slide.
			const height: number = slides[ this.currentSlideIndex - 1 ].scrollHeight;
			slidesContainer.style.height = `${ height }px`;
		} else {
			// Set the height of the container to be the height of the tallest slide.
			let height: number = 0;
			slides.forEach( ( slide: TPSliderSlideElement ): void => {
				if ( slide.scrollHeight > height ) {
					height = slide.scrollHeight;
				}
			} );

			slidesContainer.style.height = `${ height }px`;
		}
	}

	/**
	 * Resize the slider when the window is resized.
	 *
	 * @protected
	 */
	handleResize(): void {
		// Check if we're already resizing.
		if ( this.getAttribute( 'resizing' ) ) {
			return;
		}

		// First, lets flag this component as resizing.
		this.setAttribute( 'resizing', 'yes' );

		// Run the slide (so height can be resized).
		this.slide();

		// Done, let's remove the flag.
		this.removeAttribute( 'resizing' );
	}

	/**
	 * Detect touch start event, and store the starting location.
	 *
	 * @param {Event} e Touch event.
	 *
	 * @protected
	 */
	protected handleTouchStart( e: TouchEvent ): void {
		if ( 'yes' === this.getAttribute( 'swipe' ) ) {
			this.touchStartX = e.touches[ 0 ].clientX;
		}
	}

	/**
	 * Detect touch end event, and check if it was a left or right swipe.
	 *
	 * @param {Event} e Touch event.
	 *
	 * @protected
	 */
	protected handleTouchEnd( e: TouchEvent ): void {
		if ( 'yes' !== this.getAttribute( 'swipe' ) ) {
			return;
		}

		const touchEndX: number = e.changedTouches[ 0 ].clientX;
		const swipeDistance: number = touchEndX - this.touchStartX;

		if ( swipeDistance > 0 ) {
			this.previous();
		} else if ( swipeDistance < 0 ) {
			this.next();
		}
	}

	/**
	 * Auto slide.
	 */
	protected autoSlide(): void {
		// Auto Slide.
		const autoSlideInterval: string | null = this.getAttribute( 'auto-slide-interval' );

		// Check if we have an auto slider interval.
		if ( ! autoSlideInterval ) {
			return;
		}

		// Check for a valid interval.
		const interval: number = parseInt( autoSlideInterval );
		if ( interval <= 0 ) {
			return;
		}

		// Run this on a timeout, rather than interval, so the interval can be controlled after
		// the component is initialised.
		setTimeout( (): void => {
			this.next();
			this.autoSlide();
			this.dispatchEvent( new CustomEvent( 'auto-slide-complete' ) );
		}, interval );
	}
}
