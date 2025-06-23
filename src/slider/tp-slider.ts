/**
 * Internal dependencies.
 */
import { TPSliderSlidesElement } from './tp-slider-slides';
import { TPSliderSlideElement } from './tp-slider-slide';
import { TPSliderCountElement } from './tp-slider-count';
import { TPSliderNavElement } from './tp-slider-nav';
import { TPSliderNavItemElement } from './tp-slider-nav-item';
import { TPSliderArrowElement } from './tp-slider-arrow';

/**
 * TP Slider.
 */
export class TPSliderElement extends HTMLElement {
	/**
	 * Properties.
	 */
	protected isProgramaticScroll: boolean = false;
	protected _observer: IntersectionObserver;
	protected slideTrack: TPSliderSlidesElement | null;
	protected slides: NodeListOf<TPSliderSlideElement> | null;
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
		this.slides = this.querySelectorAll( 'tp-slider-slide' );
		this.slideTrack = this.querySelector( 'tp-slider-track' );
		this._observer = new IntersectionObserver( this.attributeChangeOnScroll?.bind( this ), { root: this.slideTrack, threshold: 1, rootMargin: '0px 0px 90% 0px' } );
// console.log(this.slides);

		// Set current slide.
		if ( ! this.getAttribute( 'current-slide' ) ) {
			this.setAttribute( 'current-slide', '1' );
		}

		// Initialize slider.
		this.slide();
		this.autoSlide();
		this.setAttribute( 'initialized', 'yes' );

		// Observe which slide is in view.
		this.slides.forEach( ( slide ) => this._observer.observe( slide ) );

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
		// Keep an eye on current slide.
		if ( 'current-slide' === name && oldValue !== newValue ) {
			// console.log('in attribute changed callback');

			// if( ! this.isProgramaticScroll ) {
			// 	this.updateHeight();
			// }
			
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
	 * Change current-slide attribute on scroll.
	 *
	 * @param {IntersectionObserverEntry[]} entries slides which enter or leave on scroll.
	 */
	attributeChangeOnScroll( entries: IntersectionObserverEntry[] ): void {
		console.log( 'attributeChangeOnScroll', entries );
		
		// If the scroll is programatic.
		if ( this.isProgramaticScroll ) {
			// Do nothing.
			return;
		}
		
		// Change the current slide index when slide comes into view.
		entries?.forEach( ( entry ) => {
			// Check if the entry is intersecting with the slide track.
			if ( entry.isIntersecting && entry.target instanceof TPSliderSlideElement && this.slides ) {
				const index = Array.from( this.slides ).indexOf( entry.target );
				console.log( 'index', index, this.perView, this.currentSlideIndex );
				
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
	 * Slide to the current slide.
	 *
	 * @protected
	 */
	protected slide(): void {
		// console.log("i am in slide");
		
		// Check if slider is disabled.
		if ( 'yes' === this.getAttribute( 'disabled' ) ) {
			// Yes, it is. So stop.
			return;
		}

		// Get slides.
		const slidesContainer: TPSliderSlidesElement | null = this.querySelector( 'tp-slider-slides' );
		const slides: NodeListOf<TPSliderSlideElement> | null | undefined = this.getSlideElements();

		// Check if we have slide container and slides.
		if ( ! slidesContainer || ! slides ) {
			// No, we don't. Either one of them or both are missing. So stop.
			return;
		}

		// First, update the height.

		// Yield to main thread to fix a bug in Safari 16.
		setTimeout( () => this.updateHeight(), 0 );

		// Now lets slide!
		const behaviour: string = this.getAttribute( 'behaviour' ) || '';

		// Check if behaviour is set to fade and slide on the current slide index is present in the slides array.
		if ( 'fade' !== behaviour && slides[ this.currentSlideIndex - 1 ] ) {
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
		const sliderNav: TPSliderNavElement | null = this.querySelector( 'tp-slider-nav' );
		const sliderCounts: NodeListOf<TPSliderCountElement> | null = this.querySelectorAll( 'tp-slider-count' );
		const leftArrow: TPSliderArrowElement | null = this.getArrow( 'tp-slider-arrow[direction="previous"]' );
		const rightArrow: TPSliderArrowElement | null = this.getArrow( 'tp-slider-arrow[direction="next"]' );

		// Set active slide.
		const slides: NodeListOf<TPSliderSlideElement> | null | undefined = this.getSlideElements();

		// Check if slides are available.
		if ( slides ) {
			slides.forEach( ( slide: TPSliderSlideElement, index: number ): void => {
				// Update active attribute.
				if ( this.currentSlideIndex - 1 === index ) {
					slide.setAttribute( 'active', 'yes' );
				} else {
					slide.removeAttribute( 'active' );
				}
			} );
		}

		// First, set the template for the slider nav.
		sliderNav?.updateNavItems();

		// Once the template has been set, query the slider nav items.
		const sliderNavItems: NodeListOf<TPSliderNavItemElement> | null = this.querySelectorAll( 'tp-slider-nav-item' );

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

		// Bail early if we don't want it to be flexible height - as long as it doesn't fade.
		if ( 'yes' !== this.getAttribute( 'flexible-height' ) && 'fade' !== this.getAttribute( 'behaviour' ) ) {
			// Remove height property for good measure!
			slidesContainer.style.removeProperty( 'height' );

			// Bail early.
			return;
		}

		// Get slides.
		const slides: NodeListOf<TPSliderSlideElement> | null | undefined = this.getSlideElements();

		// Check if slides are available.
		if ( ! slides ) {
			// No slides to resize.
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
					// Check if the slide exists.
					if ( slides[ i ].scrollHeight > maxHeight ) {
						maxHeight = slides[ i ].scrollHeight;
					}
				}

				// Set the height of the container to be the max height of the slides in the current view.
				slidesContainer.style.height = `${ maxHeight }px`;
			} else {
				// console.log("i am in update height");
				// Set the height of the container to be the height of the current slide.
				const height: number = slides[ this.currentSlideIndex - 1 ].scrollHeight;
				slidesContainer.style.height = `${ height }px`;
			}
		} else {
			// Set the height of the container to be the height of the tallest slide.
			let height: number = 0;

			// Traverse all slides and add their height to the array.
			slides.forEach( ( slide: TPSliderSlideElement ): void => {
				// Set the height of the container to be the height of the tallest slide.
				if ( slide.scrollHeight > height ) {
					height = slide.scrollHeight;
				}
			} );

			// Set the height of the container to be the height of the tallest slide.
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
