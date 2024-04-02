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
		super();
		this.querySelector( 'button' )?.addEventListener( 'click', this.handleClick.bind( this ) );
	}

	/**
	 * Handle when the button is clicked.
	 */
	handleClick(): void {
		const slider: TPSliderElement | null = this.closest( 'tp-slider' );
		if ( ! slider ) {
			return;
		}

		slider.setCurrentSlide( this.getIndex() );
	}

	/**
	 * Get index of this item inside the navigation.
	 *
	 * @return {number} Index.
	 */
	getIndex(): number {
		if ( this.getAttribute( 'index' ) ) {
			return parseInt( this.getAttribute( 'index' ) ?? '0' );
		}

		const slideNav: TPSliderNavElement | null = this.closest( 'tp-slider-nav' );
		return Array.from( slideNav?.children ?? [] ).indexOf( this ) + 1;
	}
}
