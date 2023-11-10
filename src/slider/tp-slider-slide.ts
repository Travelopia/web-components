import { TPSliderSlidesElement } from './tp-slider-slides';
import { TPSliderElement } from './tp-slider';

/**
 * TP Slide.
 */
export class TPSliderSlideElement extends HTMLElement {
	connectedCallback(): void {
		const observer = new IntersectionObserver( this.handleIntersect.bind( this ), {
			root: this.closest( 'tp-slider-slides' ),
			rootMargin: '0px',
			threshold: 1.0,
		} );
		observer.observe( this );
	}

	protected handleIntersect( entries: IntersectionObserverEntry[] ): void {
		entries.forEach( ( entry: IntersectionObserverEntry ): void => {
			if ( 1 === entry.intersectionRatio ) {
				const slides: TPSliderSlidesElement | null = this.closest( 'tp-slider-slides' );
				if ( slides ) {
					const slider: TPSliderElement | null = this.closest( 'tp-slider' );
					slider?.setCurrentSlide( Array.from( slides.children ).indexOf( this ) + 1 );
				}
			}
		} );
	}
}
