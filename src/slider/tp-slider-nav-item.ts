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
	 * Properties.
	 */
	protected slider : TPSliderElement | null;

	/**
	 * Constructor.
	 */
	constructor() {
		// Initialize parent.
		super();
		this.slider = this.closest( 'tp-slider' );

		// Get the nav-item button.
		this.querySelector( 'button' )?.addEventListener( 'click', this.handleClick.bind( this ) );
	}

	/**
	 * Handle when the button is clicked.
	 */
	handleClick(): void {
		// Check if slider exists.
		if ( ! this.slider ) {
			// No its not! Terminate.
			return;
		}

		// Set current slide.
		this.slider.setCurrentSlide( this.getIndex() );
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
		const step = this.slider?.step;

		// Return index of this element considering the step value.
		return ( Array.from( slideNav?.children ?? [] ).indexOf( this ) * ( step ?? 1 ) ) + 1;
	}
}
