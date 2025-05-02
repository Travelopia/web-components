/**
 * Internal dependencies.
 */

import { TPSliderArrowElement } from "./tp-slider-arrow";
import { TPSliderSlideElement } from "./tp-slider-slide";
import { TPSliderSlidesElement } from "./tp-slider-slides";

/**
 * TP Slider.
 */
export class TPSliderElement extends HTMLElement {
	// protected _observer: IntersectionObserver;
	protected slides: NodeListOf<TPSliderSlideElement> | null;
	protected slideTrack: TPSliderSlidesElement | null;
	/**
	 * Constructor.
	 */
	constructor() {
		// Initialize parent.
		super();

		this.slides = this.querySelectorAll( 'tp-slider-slide' );
		this.slideTrack = this.querySelector( 'tp-slider-slides' );
		// this._observer = new IntersectionObserver( this.attributeChangeOnScroll?.bind( this ), { root: this.slideTrack, threshold: 0.999 } );
	
		// Set current slide.
		if (!this.getAttribute("current-slide")) {
			this.setAttribute("current-slide", "1");
		}

		// Initialize slider.
		this.slide();
		this.setAttribute( 'initialized', 'yes' );

		// Observe which slide is in view.
		// this.slides.forEach(( slide ) => this._observer.observe( slide ) );
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
	 * Change current-slide attribute on scroll.
	 */
	// attributeChangeOnScroll( entries: IntersectionObserverEntry[] ): void {
	// 	entries?.forEach( ( entry ) => {
	// 		if (entry.isIntersecting && entry.target instanceof TPSliderSlideElement && this.slides) {
	// 			const index = Array.from(this.slides).indexOf(entry.target);
	// 			this.currentSlideIndex = index + 1;
	// 		  }
	// 	} );
		
	// }
	

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
		return parseInt(this.getAttribute("current-slide") ?? "1");
	}

	/**
	 * Set current slide index.
	 *
	 * @param {number} index Slide index.
	 */
	set currentSlideIndex(index: number) {
		// Set the current slide index.
		this.setCurrentSlide(index);
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
		const slidesElement: TPSliderSlidesElement | null = this.querySelector("tp-slider-slides");
		const slides: NodeListOf<TPSliderSlideElement> | null | undefined = slidesElement?.querySelectorAll(":scope > tp-slider-slide");

		// Return array of slides.
		return slides;
	}

	/**
	 * Slide to the current slide.
	 *
	 * @protected
	 */
	protected slide(): void {
		// Check if slider is disabled.
		if ("yes" === this.getAttribute("disabled")) {
			// Yes, it is. So stop.
			return;
		}

		// Get slides.
		const slidesContainer: TPSliderSlidesElement | null = this.querySelector("tp-slider-slides");
		const slides: NodeListOf<TPSliderSlideElement> | null | undefined = this.getSlideElements();

		// Check if we have slide container and slides.
		if (!slidesContainer || !slides) {
			// No, we don't. Either one of them or both are missing. So stop.
			return;
		}
		

		// First, update the height.

		// Yield to main thread to fix a bug in Safari 16.
		// setTimeout( () => this.updateHeight(), 0 );

		// Now lets slide!
		const behaviour: string = this.getAttribute("behaviour") || "";

		// Check if behaviour is set to fade and slide on the current slide index is present in the slides array.
		if ("fade" !== behaviour && slides[this.currentSlideIndex - 1]) {
			// Yes, it is. So slide to the current slide.
			slidesContainer.scroll( { 
				left: slides[this.currentSlideIndex - 1].offsetLeft - slides[0].offsetLeft,
				behavior: 'smooth',
			});
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
		// const sliderNav: TPSliderNavElement | null = this.querySelector( 'tp-slider-nav' );
		// const sliderCounts: NodeListOf<TPSliderCountElement> | null = this.querySelectorAll( 'tp-slider-count' );
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
		// sliderNav?.updateNavItems();

		// Once the template has been set, query the slider nav items.
		// const sliderNavItems: NodeListOf<TPSliderNavItemElement> | null = this.querySelectorAll( 'tp-slider-nav-item' );

		// Set current slider nav item.
		// if ( sliderNavItems ) {
		// 	sliderNavItems.forEach( ( navItem: TPSliderNavItemElement, index: number ): void => {
		// 		// Update current attribute after considering step.
		// 		if ( Math.ceil( this.currentSlideIndex / this.step ) - 1 === index ) {
		// 			navItem.setAttribute( 'current', 'yes' );
		// 		} else {
		// 			navItem.removeAttribute( 'current' );
		// 		}
		// 	} );
		// }

		// Update slider count.
		// if ( sliderCounts ) {
		// 	// Set total attribute.
		// 	this.setAttribute( 'total', this.getTotalSlides().toString() );

		// 	// Update slider counts.
		// 	sliderCounts.forEach( ( slideCount: TPSliderCountElement ) => {
		// 		// Check if the slideCount.update is a function.
		// 		if ( 'function' === typeof slideCount.update ) {
		// 			// Update slide count.
		// 			slideCount.update();
		// 		}
		// 	} );
		// }

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
		// else {
		// 	rightArrow?.removeAttribute( 'disabled' );
		// 	leftArrow?.removeAttribute( 'disabled' );
		// }
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
		if (slides) {
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
	setCurrentSlide(index: number): void {
		// Check if slide index is valid.
		if (index > this.getTotalSlides() || index <= 0) {
			// Stop! It's not valid.
			return;
		}

		// dispatch slide-set event.
		this.dispatchEvent(
			new CustomEvent("slide-set", {
				bubbles: true,
				detail: {
					slideIndex: index,
				},
			}),
		);

		// Set current slide index.
		this.setAttribute("current-slide", index.toString());
	}

	/**
	 * Navigate to the next slide.
	 */
	next(): void {
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
}
