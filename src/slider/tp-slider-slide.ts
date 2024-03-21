/**
 * Internal dependencies.
 */
import { TPSliderElement } from './tp-slider';

/**
 * TP Slider Slide.
 */
export class TPSliderSlideElement extends HTMLElement {
	/**
	 * Connected callback.
	 */
	connectedCallback(): void {
		// Resize observer.
		if ( 'ResizeObserver' in window ) {
			new ResizeObserver( this.handleHeightChange.bind( this ) ).observe( this );
		}
	}

	/**
	 * Handle slide height change.
	 */
	protected handleHeightChange(): void {
		const slider: TPSliderElement | null = this.closest( 'tp-slider' );
		if ( ! slider ) {
			return;
		}

		/**
		 * Yield to main thread to avoid observation errors.
		 *
		 * @see https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver#observation_errors
		 */
		setTimeout( (): void => {
			slider.handleResize();
		}, 0 );
	}
}
