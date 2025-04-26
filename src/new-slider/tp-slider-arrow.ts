/**
 * Internal dependencies.
 */

import { TPSliderElement } from "./tp-slider";

/**
 * TP Slider Arrow.
 */
export class TPSliderArrowElement extends HTMLElement {


	/**
	 * Constructor.
	 */
	constructor() {

		super();

		// Get the button and add event listener.
		this.querySelector( 'button' )?.addEventListener( 'click', this.handleClick.bind( this ) );

	}

	/**
		 * Handle when the button is clicked.
		 */
		handleClick(): void {
			// If disabled, do nothing.
			if ( 'yes' === this.getAttribute( 'disabled' ) ) {
				// Early return.
				return;
			}
	
			// Get the slider.
			const slider: TPSliderElement | null = this.closest( 'tp-slider' );
	
			// If no slider, early return.
			if ( ! slider ) {
				// Early return.
				return;
			}
	
			// Initiate slider according to the direction of the button clicked.
			if ( 'previous' === this.getAttribute( 'direction' ) ) {
				slider.previous();
			} else if ( 'next' === this.getAttribute( 'direction' ) ) {
				slider.next();
			}
		}


}
