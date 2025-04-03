/**
 * Internal dependencies.
 */
import { TPSliderElement } from './tp-slider';

/**
 * TP Slider Nav.
 */
export class TPSliderNavElement extends HTMLElement {
	/**
	 * Properties.
	 */
	protected template: HTMLTemplateElement | null = null;
	protected slider: TPSliderElement | null = null;

	/**
	 * Constructor.
	 */
	constructor() {
		// Initialize parent.
		super();

		// Get elements.
		this.template = this.querySelector( 'template' );
		this.slider = this.closest( 'tp-slider' );
	}

	/**
	 * Update nav items based on template.
	 */
	public updateNavItems(): void {
		// Bail if no template.
		if ( ! this.template || ! this.slider ) {
			// Exit.
			return;
		}

		// Total slides.
		const totalSlides: number = this.slider?.getTotalSlides();

		// Calculate the number of navigation items.
		const totalNavItems: number = this.slider?.perView > this.slider?.step ? Math.ceil((totalSlides - this.slider?.perView) / this.slider?.step) + 1 : this.slider?.totalSlidesGroups();

		// Clear the navigation.
		this.innerHTML = '';

		// Append the navigation items.
		for ( let i = 1; i <= totalNavItems; i++ ) {
			// Clone the template.
			const navItem: Node = this.template.content.cloneNode( true );
			const div: HTMLDivElement = document.createElement( 'div' );
			div.appendChild( navItem );

			// Append the navigation item.
			this.innerHTML += div.innerHTML.replace( '$index', i.toString() );
		}
	}
}
