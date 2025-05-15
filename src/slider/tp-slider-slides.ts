/**
 * Internal dependencies.
 */
import { TPSliderElement } from './tp-slider';

/**
 * TP Slider Slides.
 */
export class TPSliderSlidesElement extends HTMLElement {
	/**
	 * Constructor.
	 */
	constructor() {
		// Initialize parent.
		super();

		// Resize observer.
		if ( 'ResizeObserver' in window ) {
			new ResizeObserver( this.handleHeightChange.bind( this ) ).observe( this );
		}
	}

	/**
	 * Handle slide height change.
	 */
	protected handleHeightChange(): void {
		// Get the parent tp-slider element.
		const slider: TPSliderElement | null = this.closest( 'tp-slider' );

		// Bail if not found.
		if ( ! slider ) {
			// Bail early if not found.
			return;
		}

		/**
		 * Yield to main thread to avoid observation errors.
		 *
		 * @see https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver#observation_errors
		 */
		setTimeout( (): void => {
			// Handle resize.
			slider.handleResize();
		}, 0 );
	}
}
