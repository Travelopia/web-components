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

		if ( ! this.getAttribute( 'current-slide' ) ) {
			this.setAttribute( 'current-slide', '1' );
		}

		this.slide();
		this.setAttribute( 'initialized', 'yes' );

		window.addEventListener( 'resize', this.handleResize.bind( this ) );
	}

	static get observedAttributes(): string[] {
		return [ 'current-slide', 'flexible-height', 'infinite' ];
	}

	attributeChangedCallback( name: string = '', oldValue: string = '', newValue: string = '' ): void {
		if ( 'current-slide' === name && oldValue !== newValue ) {
			this.slide();
			this.dispatchEvent( new CustomEvent( 'slide-complete', { bubbles: true } ) );
		}

		this.update();
	}

	get currentSlideIndex(): number {
		return parseInt( this.getAttribute( 'current-slide' ) ?? '1' );
	}

	set currentSlideIndex( index: number ) {
		this.setCurrentSlide( index );
	}

	getSlides(): NodeListOf<TPSliderSlideElement> | null {
		return this.querySelectorAll( 'tp-slider-slide' );
	}

	getTotalSlides(): number {
		const slides: NodeListOf<TPSliderSlideElement> | null = this.getSlides();
		if ( slides ) {
			return slides.length;
		}

		return 0;
	}

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

	previous(): void {
		if ( this.currentSlideIndex <= 1 ) {
			if ( 'yes' === this.getAttribute( 'infinite' ) ) {
				this.setCurrentSlide( this.getTotalSlides() );
			}

			return;
		}

		this.setCurrentSlide( this.currentSlideIndex - 1 );
	}

	getCurrentSlide(): number {
		return this.currentSlideIndex;
	}

	setCurrentSlide( index: number ): void {
		if ( index > this.getTotalSlides() || index <= 0 ) {
			return;
		}

		this.dispatchEvent( new CustomEvent( 'before-slide', { bubbles: true } ) );
		this.setAttribute( 'current-slide', index.toString() );
	}

	protected slide(): void {
		const slidesContainer: TPSliderSlidesElement | null = this.querySelector( 'tp-slider-slides' );
		const slides: NodeListOf<TPSliderSlideElement> | null = this.getSlides();
		if ( ! slidesContainer || ! slides ) {
			return;
		}

		this.updateHeight();
		slidesContainer.style.left = `-${ this.offsetWidth * ( this.currentSlideIndex - 1 ) }px`;
	}

	update(): void {
		const sliderNavItems: NodeListOf<TPSliderNavItemElement> | null = this.querySelectorAll( 'tp-slider-nav-item' );
		const sliderCount: TPSliderCountElement | null = this.querySelector( 'tp-slider-count' );
		const leftArrow: TPSliderArrowElement | null = this.querySelector( 'tp-slider-arrow[direction="previous"]' );
		const rightArrow: TPSliderArrowElement | null = this.querySelector( 'tp-slider-arrow[direction="next"]' );

		const slides: NodeListOf<TPSliderSlideElement> | null = this.getSlides();
		slides?.forEach( ( slide: TPSliderSlideElement, index: number ) => {
			if ( this.currentSlideIndex - 1 === index ) {
				slide.setAttribute( 'active', 'yes' );
			} else {
				slide.removeAttribute( 'active' );
			}
		} );

		if ( sliderNavItems ) {
			sliderNavItems.forEach( ( navItem: TPSliderNavItemElement, index: number ): void => {
				if ( this.currentSlideIndex - 1 === index ) {
					navItem.setAttribute( 'current', 'yes' );
				} else {
					navItem.removeAttribute( 'current' );
				}
			} );
		}

		if ( sliderCount ) {
			sliderCount.setAttribute( 'current', this.getCurrentSlide().toString() );
			sliderCount.setAttribute( 'total', this.getTotalSlides().toString() );
		}

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

	updateHeight(): void {
		const slidesContainer: TPSliderSlidesElement | null = this.querySelector( 'tp-slider-slides' );
		if ( ! slidesContainer ) {
			return;
		}

		if ( 'yes' !== this.getAttribute( 'flexible-height' ) ) {
			slidesContainer.style.removeProperty( 'height' );
			return;
		}

		const slides: NodeListOf<TPSliderSlideElement> | null = this.getSlides();
		if ( ! slides ) {
			return;
		}

		const height: number = slides[ this.currentSlideIndex - 1 ].scrollHeight;
		slidesContainer.style.height = `${ height }px`;
	}

	protected handleResize(): void {
		this.setAttribute( 'resizing', 'yes' );
		this.slide();
		this.removeAttribute( 'resizing' );
	}
}
