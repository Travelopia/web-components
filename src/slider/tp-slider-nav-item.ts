/**
 * Internal dependencies.
 */
import { TPSliderElement } from './tp-slider';
import { TPSliderNavElement } from './tp-slider-nav';

/**
 * TP Slider Nav Item.
 */
export class TPSliderNavItemElement extends HTMLElement {
	/**
	 * Constructor.
	 */
	constructor() {
		// Initialize parent.
		super();

		// Get the nav-item button.
		this.querySelector( 'button' )?.addEventListener( 'click', this.handleClick.bind( this ) );
	}

	/**
	 * Handle when the button is clicked.
	 */
	handleClick(): void {
		// Get the slider.
		const slider: TPSliderElement | null = this.closest( 'tp-slider' );

		// Check if slider exists.
		if ( ! slider ) {
			// No its not! Terminate.
			return;
		}

		// Set current slide.
		slider.setCurrentSlide( this.getIndex() );
	}

	/**
	 * Get index of this item inside the navigation.
	 *
	 * @return {number} Index.
	 */
	getIndex(): number {
		// Check if we have an index.
		if ( this.getAttribute( 'index' ) ) {
			// Yes, return it.
			return parseInt( this.getAttribute( 'index' ) ?? '0' );
		}

		// No, find it in the navigation.
		const slideNav: TPSliderNavElement | null = this.closest( 'tp-slider-nav' );

		// Return index of this element.
		return Array.from( slideNav?.children ?? [] ).indexOf( this ) + 1;
	}
}
