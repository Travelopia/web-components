/**
 * Internal dependencies.
 */
import { TPLightboxElement } from './tp-lightbox';
import { TPLightboxNavElement } from './tp-lightbox-nav';

/**
 * TP Lightbox Nav Item.
 */
export class TPLightboxNavItemElement extends HTMLElement {
	/**
	 * Properties.
	 */
	protected lightbox : TPLightboxElement | null;

	/**
	 * Constructor.
	 */
	constructor() {
		// Initialize parent.
		super();
		this.lightbox = this.closest( 'tp-lightbox' );

		// Get the nav-item button.
		this.querySelector( 'button' )?.addEventListener( 'click', this.handleClick.bind( this ) );
	}

	/**
	 * Handle when the button is clicked.
	 */
	handleClick(): void {
		// Check if lightbox exists.
		if ( ! this.lightbox ) {
			// No its not! Terminate.
			return;
		}

		// Set current slide.
		this.lightbox.setCurrentSlide( this.getIndex() );

		// Update navigation current item.
		this.lightbox.updateNavCurrentItem();
	}

	/**
	 * Get index of this item inside the navigation.
	 *
	 * @return {number} Index.
	 */
	getIndex(): number {

		// Bail if no lightbox.
		if ( ! this.lightbox ) {
			return 0;
		}

		// No, find it in the navigation.
		const lightboxNav: TPLightboxNavElement | null = this.closest( 'tp-lightbox-nav' );

		// Return index of this element considering the step value.
		return ( Array.from( lightboxNav?.children ?? [] ).indexOf( this ) ) + 1;
	}
}
