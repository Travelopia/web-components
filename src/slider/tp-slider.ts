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
		super();

		// Set current slide.
		if ( ! this.getAttribute( 'current-slide' ) ) {
			this.setAttribute( 'current-slide', '1' );
		}

		// Initialize slider.
		this.slide();
		this.autoSlide();
		this.setAttribute( 'initialized', 'yes' );

		// Responsive Settings.
		const responsiveSettingsJSON: string = this.getAttribute( 'responsive' ) || '';
		this.responsiveSettings = responsiveSettingsJSON ? JSON.parse( responsiveSettingsJSON ) : [];

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
		return [ 'current-slide', 'flexible-height', 'infinite', 'swipe', 'per-view', 'step' ];
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
	 * Get current step.
	 *
	 * @return {number} Current step.
	 */
	get step(): number {
		return parseInt( this.getAttribute( 'step' ) ?? '1' );
	}

	/**
	 * Set current step.
	 *
	 * @param {number} step Step.
	 */
	set step( step: number ) {
		this.setAttribute( 'step', step.toString() );
	}

	/**
	 * Get per view.
	 *
	 * @return {number} Current step.
	 */
	get perView(): number {
		return parseInt( this.getAttribute( 'per-view' ) ?? '1' );
	}

	/**
	 * Set per view.
	 *
	 * @param {number} perView Per view.
	 */
	set perView( perView: number ) {
		this.setAttribute( 'per-view', perView.toString() );
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

		const nextSlideIndex: number = this.currentSlideIndex + this.step;

		// Check if the next slide step is not taking it beyond the last slide.
		if ( nextSlideIndex > totalSlides ) {
			return;
		}

		this.setCurrentSlide( nextSlideIndex );
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

		const previousSlideNumber: number = this.currentSlideIndex - this.step;

		// Check if the previous slide step is not taking it beyond the first slide.
		if ( previousSlideNumber > 1 ) {
			this.setCurrentSlide( previousSlideNumber );
		} else {
			this.setCurrentSlide( 1 );
		}
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
				// Check if the slideCount.update is a function.
				if ( 'function' === typeof slideCount.update ) {
					// Update slide count.
					slideCount.update();
				}
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
			// Check if per-view is greater than 1.
			if ( this.perView > 1 ) {
				const currentIndex: number = this.currentSlideIndex - 1;
				const slidesOnCurrentView: number = currentIndex + this.perView;
				let maxHeight: number = 0;

				// Traverse all slides in the current view and add their height to the array.
				for ( let i: number = currentIndex; i < slidesOnCurrentView; i++ ) {
					if ( slides[ i ].scrollHeight > maxHeight ) {
						maxHeight = slides[ i ].scrollHeight;
					}
				}

				// Set the height of the container to be the max height of the slides in the current view.
				slidesContainer.style.height = `${ maxHeight }px`;
			} else {
				// Set the height of the container to be the height of the current slide.
				const height: number = slides[ this.currentSlideIndex - 1 ].scrollHeight;
				slidesContainer.style.height = `${ height }px`;
			}
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
		// Update responsive settings. We are using setTimeout for INP( Interaction for Next Paint ).
		setTimeout( () => {
			this.updateAttributesResponsively();
		}, 0 );

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
