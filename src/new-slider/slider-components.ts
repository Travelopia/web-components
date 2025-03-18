/**
 * components/tp-slider-track.ts
 * Container for the slider slides
 */
export class TPSliderTrack extends HTMLElement {
	constructor() {
		super();
	}

	// TODO: Add comment.
	connectedCallback() {
		this.classList.add( 'tp-slider-track' );
	}
}

/**
 * components/tp-slider-slides.ts
 * Container for individual slides
 */
export class TPSliderSlides extends HTMLElement {
	constructor() {
		super();
	}

	// TODO: Add comment.
	connectedCallback() {
		this.classList.add( 'tp-slider-slides' );
	}
}

/**
 * components/tp-slider-slide.ts
 * Individual slide component
 */
export class TPSliderSlide extends HTMLElement {
	constructor() {
		super();
	}

	// TODO: Add comment.
	connectedCallback() {
		this.classList.add( 'tp-slider-slide' );
	}
}

/**
 * components/tp-slider-arrow.ts
 * Navigation arrow component
 */
export class TPSliderArrow extends HTMLElement {
	get direction(): string {
		return this.getAttribute( 'direction' ) || 'next';
	}

	// TODO: Add comment.
	constructor() {
		super();
	}

	// TODO: Add comment.
	connectedCallback() {
		this.classList.add( 'tp-slider-arrow' );
		this.classList.add( this.direction );
	}
}

/**
 * components/tp-slider-nav.ts
 * Navigation dots container
 */
export class TPSliderNav extends HTMLElement {
	constructor() {
		super();
	}

	// TODO: Add comment.
	connectedCallback() {
		this.classList.add( 'tp-slider-nav' );
	}
}

/**
 * components/tp-slider-nav-item.ts
 * Individual navigation dot
 */
export class TPSliderNavItem extends HTMLElement {
	constructor() {
		super();
	}

	// TODO: Add comment.
	connectedCallback() {
		this.classList.add( 'tp-slider-nav-item' );
	}
}

/**
 * components/tp-slider-count.ts
 * Slide counter component
 */
export class TPSliderCount extends HTMLElement {
	get current(): number {
		return parseInt( this.getAttribute( 'current' ) || '1', 10 );
	}

	// TODO: Add comment.
	get total(): number {
		return parseInt( this.getAttribute( 'total' ) || '1', 10 );
	}

	// TODO: Add comment.
	get format(): string {
		return this.getAttribute( 'format' ) || '$current / $total';
	}

	// TODO: Add comment.
	constructor() {
		super();
	}

	// TODO: Add comment.
	connectedCallback() {
		this.classList.add( 'tp-slider-count' );
		this.updateDisplay();
	}

	// TODO: Add comment.
	static get observedAttributes() {
		return [ 'current', 'total', 'format' ];
	}

	// TODO: Add comment.
	attributeChangedCallback() {
		this.updateDisplay();
	}

	// TODO: Add comment.
	updateDisplay() {
		const formattedText = this.format
			.replace( '$current', this.current.toString() )
			.replace( '$total', this.total.toString() );

		// TODO: Add comment.
		this.textContent = formattedText;
	}
}
