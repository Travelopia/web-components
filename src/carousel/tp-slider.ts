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
	protected touchStartY: number = 0;
	protected swipeThreshold: number = 200;
	protected responsiveSettings: { [ key: string ]: any };
	protected allowedResponsiveKeys: string[] = [
		'flexible-height',
		'infinite',
		'swipe',
		'behaviour',
		'auto-slide-interval',
		'per-view',
		'step',
		'responsive',
	];

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

		// Threshold Setting.
		this.swipeThreshold = Number( this?.getAttribute( 'swipe-threshold' ) ?? '200' );

		// Initialize slider.
		this.slide();
		this.autoSlide();
		this.setAttribute( 'initialized', 'yes' );

		// Responsive Settings.
		const responsiveSettingsJSON: string = this.getAttribute( 'responsive' ) || '';
		this.responsiveSettings = responsiveSettingsJSON ? JSON.parse( responsiveSettingsJSON ) : [];

		// Event listeners.
		if ( ! ( 'ResizeObserver' in window ) ) {
			/**
			 * We set the resize observer in `tp-slider-slide`
			 * because These are just fallbacks for browsers that don't support ResizeObserver.
			 */

			// @ts-ignore
			window.addEventListener( 'resize', this.handleResize.bind( this ) );
			document.fonts.ready.then( () => this.handleResize() );
		}

		// Touch listeners.
		this.addEventListener( 'touchstart', this.handleTouchStart.bind( this ), { passive: true } );
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
		// Observed attributes.
		return [ 'current-slide', 'infinite', 'per-view', 'step' ];
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
			this.update();
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
		const totalSlides: number = this.getTotalSlides();
        let nextSlideIndex = this.currentSlideIndex + this.step;

        if ('yes' !== this.getAttribute('infinite') && nextSlideIndex > totalSlides - this.perView + 1) {
            nextSlideIndex = totalSlides - this.perView + 1;
        } else if ('yes' === this.getAttribute('infinite') && nextSlideIndex > totalSlides) {
            nextSlideIndex = nextSlideIndex % totalSlides;
            if(nextSlideIndex === 0) nextSlideIndex = totalSlides;
        }

        this.setCurrentSlide(nextSlideIndex);
	}

	/**
	 * Navigate to the previous slide.
	 */
	previous(): void {
		const totalSlides: number = this.getTotalSlides();
        let previousSlideNumber: number = this.currentSlideIndex - this.step;

        if ('yes' !== this.getAttribute('infinite') && previousSlideNumber < 1) {
            previousSlideNumber = 1;
        } else if ('yes' === this.getAttribute('infinite') && previousSlideNumber < 1) {
            previousSlideNumber = totalSlides + previousSlideNumber;
        }

        this.setCurrentSlide(previousSlideNumber);
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

	/**
	 * Slide to the current slide.
	 *
	 * @protected
	 */
	protected slide(): void {
		// Check if slider is disabled.
		if ( 'yes' === this.getAttribute( 'disabled' ) ) {
			// Yes, it is. So stop.
			return;
		}

		// Get slides.
		const slidesContainer: TPSliderSlidesElement | null = this.querySelector( 'tp-slider-slides' );

		// Check if we have slide container .
		if ( ! slidesContainer ) {
			// No, we don't. container is missing. So stop.
			return;
		}

		this.updateHeight();
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
	 * Example: Update sub-components.
	 */
	update(): void {
		// Get sub-components.
		const sliderNavItems: NodeListOf<TPSliderNavItemElement> | null = this.querySelectorAll( 'tp-slider-nav-item' );
		const sliderCounts: NodeListOf<TPSliderCountElement> | null = this.querySelectorAll( 'tp-slider-count' );
		const leftArrow: TPSliderArrowElement | null = this.getArrow( 'tp-slider-arrow[direction="previous"]' );
		const rightArrow: TPSliderArrowElement | null = this.getArrow( 'tp-slider-arrow[direction="next"]' );

		// Set active slide.
		const slides: NodeListOf<TPSliderSlideElement> | null | undefined = this.getSlideElements();

        if (slides) {
            slides.forEach((slide: TPSliderSlideElement, index: number): void => {
                if (this.currentSlideIndex - 1 === index) {
                    slide.setAttribute('active', 'yes');
                } else {
                    slide.removeAttribute('active');
                }
            });
        }

		// Set current slider nav item.
		if ( sliderNavItems ) {
			sliderNavItems.forEach( ( navItem: TPSliderNavItemElement, index: number ): void => {
				// Update current attribute after considering step.
				if ( Math.ceil( this.currentSlideIndex / this.step ) - 1 === index ) {
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
				// Check if the slideCount.update is a function.
				if ( 'function' === typeof slideCount.update ) {
					// Update slide count.
					slideCount.update();
				}
			} );
		}

		// Enable / disable arrows.
		if ( 'yes' !== this.getAttribute( 'infinite' ) ) {
			// For the last slide.
			if ( this.getCurrentSlide() === this.getTotalSlides() - this.perView + 1 ) {
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
		} else {
			rightArrow?.removeAttribute( 'disabled' );
			leftArrow?.removeAttribute( 'disabled' );
		}

		this.slide();
	}

	/**
	 * Update the height of the slider based on current slide.
	 */
	updateHeight(): void {
		// Get slides container to resize.
		const slidesContainer: TPSliderSlidesElement | null = this.querySelector( 'tp-slider-slides' );

		// Check if slides container is available.
		if ( ! slidesContainer ) {
			// Early return.
			return;
		}

		if ('yes' === this.getAttribute('flexible-height')) {
			const slides = this.getSlideElements();
			if (slides) {
			  let maxHeight = 0;
			  for(let i = 0; i < slides.length; i++) {
				maxHeight = Math.max(maxHeight, slides[i].scrollHeight);
			  }
			  slidesContainer.style.height = `${maxHeight}px`;
			}
		} else {
			slidesContainer.style.removeProperty('height');
		}
	}

	/**
	 * Resize the slider when the window is resized.
	 *
	 * @protected
	 */
	handleResize(): void {
		// Update responsive settings. We are using setTimeout for INP( Interaction for Next Paint ).
		setTimeout( () => {
			// Update attributes responsive settings.
			this.updateAttributesResponsively();
		}, 0 );

		// Check if we're already resizing.
		if ( this.getAttribute( 'resizing' ) ) {
			// Yes we are, early return.
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
	 * Update attributes responsive settings.
	 */
	updateAttributesResponsively(): void {
		// Check if responsiveSettings exist.
		if ( ! this.responsiveSettings.length ) {
			// Early Return.
			return;
		}

		// Step 2: First remove all the allowed responsive keys.
		this.allowedResponsiveKeys.forEach( ( key: string ) => {
			// Remove.
			this.removeAttribute( key );
		} );

		// Step 3: Loop through responsiveSettings and check if the media query is matched.
		this.responsiveSettings.every( ( settings: { [ key: string ]: any } ) => {
			// Check if media query is matched.
			if ( window.matchMedia( settings.media ).matches ) {
				// If yes, loop through the settings at this media breakpoint.
				for ( const settingKey in settings ) {
					// Check if the setting key is not media.
					if ( 'media' !== settingKey && this.allowedResponsiveKeys.includes( settingKey ) ) {
						// Set those keys as attributes.
						this.setAttribute( settingKey, settings[ settingKey ] );
					}
				}

				// Return false to break out of the loop.
				return false;
			}

			// Return true so that the loop continues, if it does not break above.
			return true;
		} );
	}

	/**
	 * Detect touch start event, and store the starting location.
	 *
	 * @param {Event} e Touch event.
	 *
	 * @protected
	 */
	protected handleTouchStart( e: TouchEvent ): void {
		// initialize touch start coordinates
		if ( 'yes' === this.getAttribute( 'swipe' ) ) {
			this.touchStartX = e.touches[ 0 ].clientX;
			this.touchStartY = e.touches[ 0 ].clientY;
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
		// Early return if swipe is not enabled.
		if ( 'yes' !== this.getAttribute( 'swipe' ) ) {
			// Early return.
			return;
		}

		// Calculate the horizontal and vertical distance moved.
		const touchEndX: number = e.changedTouches[ 0 ].clientX;
		const touchEndY: number = e.changedTouches[ 0 ].clientY;
		const swipeDistanceX: number = touchEndX - this.touchStartX;
		const swipeDistanceY: number = touchEndY - this.touchStartY;

		// Determine if the swipe is predominantly horizontal or vertical.
		const isHorizontalSwipe: boolean = Math.abs( swipeDistanceX ) > Math.abs( swipeDistanceY );

		// If it's not horizontal swipe, return
		if ( ! isHorizontalSwipe ) {
			// Early return.
			return;
		}

		// Check if it's a right or left swipe.
		if ( swipeDistanceX > 0 ) {
			// Right-Swipe: Check if horizontal swipe distance is less than the threshold.
			if ( swipeDistanceX < this.swipeThreshold ) {
				this.previous();
			}
		} else if ( swipeDistanceX < 0 ) {
			// Left-Swipe: Check if horizontal swipe distance is less than the threshold.
			if ( swipeDistanceX > -this.swipeThreshold ) {
				this.next();
			}
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
			// Early return.
			return;
		}

		// Check for a valid interval.
		const interval: number = parseInt( autoSlideInterval );

		// Check if interval is valid.
		if ( interval <= 0 ) {
			// Early return.
			return;
		}

		// Run this on a timeout, rather than interval, so the interval can be controlled after the component is initialized.
		setTimeout( (): void => {
			// Run the next slide.
			this.next();
			this.autoSlide();
			this.dispatchEvent( new CustomEvent( 'auto-slide-complete' ) );
		}, interval );
	}
}
