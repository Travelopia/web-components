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

		// Initialise the total number of navigation items.
		let totalNavItems: number;

		// Update the total number of navigation items based on the slider's step and perView. considering perView can not be grater than the step. As if perView is greater than step, then we end up with hiding some slides on each shift.
		if ( this.slider?.perView > this.slider?.step ) {
			// Scenario 1: If the slider's step is less than the number of slides per view, we need to calculate the total number of navigation items.
			totalNavItems = Math.ceil( ( totalSlides - this.slider?.perView ) / this.slider?.step ) + 1;
		} else {
			// Scenario 2: we can create nav items equal to number of slides group.
			totalNavItems = this.slider?.getTotalSlidesGroupCount();
		}

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
