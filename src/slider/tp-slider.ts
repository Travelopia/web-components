import { TPSliderSlidesElement } from './tp-slider-slides';
import { TPSliderSlideElement } from './tp-slider-slide';
import { TPSliderCountElement } from './tp-slider-count';
import { TPSliderNavItemElement } from './tp-slider-nav-item';

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

		this.updateHeight();
		this.setAttribute( 'initialized', 'yes' );
	}

	static get observedAttributes(): string[] {
		return [ 'current-slide' ];
	}

	attributeChangedCallback( name: string = '', oldValue: string = '', newValue: string = '' ): void {
		if ( 'current-slide' === name && oldValue !== newValue ) {
			this.slide();
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
			return;
		}

		this.setCurrentSlide( this.currentSlideIndex + 1 );
	}

	previous(): void {
		if ( this.currentSlideIndex <= 1 ) {
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

	slide(): void {
		const slides: NodeListOf<TPSliderSlideElement> | null = this.getSlides();
		if ( ! slides ) {
			return;
		}

		this.updateHeight();

		slides[ this.currentSlideIndex - 1 ].scrollIntoView();

		this.dispatchEvent( new CustomEvent( 'slide-complete', { bubbles: true } ) );
	}

	update(): void {
		const sliderNavItems: NodeListOf<TPSliderNavItemElement> | null = this.querySelectorAll( 'tp-slider-nav-item' );
		const sliderCount: TPSliderCountElement | null = this.querySelector( 'tp-slider-count' );

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
}
