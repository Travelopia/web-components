/**
 * components/tp-slider.ts - Main slider component that orchestrates the functionality
 */
export class TPSlider extends HTMLElement {
	// Properties
	private currentIndex: number = 0;
	private autoPlayInterval: number | null = null;
	private touchStartX: number = 0;
	private touchEndX: number = 0;
	private responsiveSettings: any[] = [];
	private behaviour: string = 'slide'; // 'slide' or 'fade'

	// Elements (will be populated in connectedCallback)
	private track: HTMLElement | null = null;
	private slidesContainer: HTMLElement | null = null;
	private slides: HTMLElement[] = [];
	private navItems: NodeListOf<HTMLElement> | null = null;
	private countElement: HTMLElement | null = null;
	private prevArrow: HTMLElement | null = null;
	private nextArrow: HTMLElement | null = null;

	// Getters for attributes
	get infiniteScroll(): boolean {
		return this.hasAttribute( 'infinite' ) && this.getAttribute( 'infinite' ) !== 'no';
	}

	// TODO: Add comment.
	get autoSlideInterval(): number {
		return this.hasAttribute( 'auto-slide-interval' )
			? parseInt( this.getAttribute( 'auto-slide-interval' ) || '0', 10 )
			: 0;
	}

	// TODO: Add comment.
	get perView(): number {
		return this.hasAttribute( 'per-view' )
			? parseInt( this.getAttribute( 'per-view' ) || '1', 10 )
			: 1;
	}

	// TODO: Add comment.
	get step(): number {
		return this.hasAttribute( 'step' )
			? parseInt( this.getAttribute( 'step' ) || '1', 10 )
			: 1;
	}

	// TODO: Add comment.
	get flexibleHeight(): boolean {
		return this.hasAttribute( 'flexible-height' ) && this.getAttribute( 'flexible-height' ) !== 'no';
	}

	// TODO: Add comment.
	get swipeEnabled(): boolean {
		return this.hasAttribute( 'swipe' ) && this.getAttribute( 'swipe' ) !== 'no';
	}

	// TODO: Add comment.
	get swipeThreshold(): number {
		return this.hasAttribute( 'swipe-threshold' )
			? parseInt( this.getAttribute( 'swipe-threshold' ) || '50', 10 )
			: 50;
	}

	// TODO: Add comment.
	constructor() {
		super();
	}

	// TODO: Add comment.
	connectedCallback() {
		// Parse responsive settings first
		this.parseResponsiveSettings();

		// Get all the necessary elements
		this.track = this.querySelector( 'tp-slider-track' );
		this.slidesContainer = this.querySelector( 'tp-slider-slides' );
		this.slides = Array.from( this.querySelectorAll( 'tp-slider-slide' ) );
		this.navItems = this.querySelectorAll( 'tp-slider-nav-item' );
		this.countElement = this.querySelector( 'tp-slider-count' );
		this.prevArrow = this.querySelector( 'tp-slider-arrow[direction="previous"]' );
		this.nextArrow = this.querySelector( 'tp-slider-arrow[direction="next"]' );

		// Apply responsive settings
		this.applyResponsiveSettings();

		// Set up event listeners
		this.setupEventListeners();

		// Initialize slider state
		this.updateSliderState();

		// Start auto-sliding if enabled
		this.setupAutoPlay();
	}

	// TODO: Add comment.
	disconnectedCallback() {
		// Clean up event listeners
		this.removeEventListeners();

		// Stop auto-play
		if ( this.autoPlayInterval ) {
			clearInterval( this.autoPlayInterval );
			this.autoPlayInterval = null;
		}
	}

	// TODO: Add comment.
	static get observedAttributes() {
		return [
			'per-view',
			'step',
			'infinite',
			'auto-slide-interval',
			'behaviour',
			'flexible-height',
			'swipe',
			'swipe-threshold',
			'responsive',
		];
	}

	// TODO: Add comment.
	attributeChangedCallback( name: string, oldValue: string, newValue: string ) {
		if ( oldValue === newValue ) {
			return;
		}

		// TODO: Add comment.
		switch ( name ) {
			case 'responsive':
				this.parseResponsiveSettings();
				this.applyResponsiveSettings();
				break;
			case 'behaviour':
				this.behaviour = newValue || 'slide';
				this.updateSliderState();
				break;
			case 'per-view':
			case 'step':
			case 'infinite':
			case 'flexible-height':
				this.updateSliderState();
				break;
			case 'auto-slide-interval':
				this.setupAutoPlay();
				break;
			case 'swipe':
				this.updateSwipeHandlers();
				break;
		}
	}

	// Parse responsive settings from attribute
	private parseResponsiveSettings(): void {
		if ( this.hasAttribute( 'responsive' ) ) {
			try {
				this.responsiveSettings = JSON.parse( this.getAttribute( 'responsive' ) || '[]' );
			} catch ( e ) {
				console.error( 'Invalid responsive settings JSON:', e );
				this.responsiveSettings = [];
			}
		}
	}

	// Apply responsive settings based on current viewport
	private applyResponsiveSettings(): void {
		// Loop through responsive settings in reverse order (mobile-first approach)
		for ( const setting of this.responsiveSettings ) {
			if ( window.matchMedia( setting.media ).matches ) {
				// Apply settings to attributes
				Object.entries( setting ).forEach( ( [ key, value ] ) => {
					if ( key !== 'media' ) {
						this.setAttribute( key, String( value ) );
					}
				} );
				break; // Apply only the first matching media query
			}
		}
	}

	// Set up event listeners
	private setupEventListeners(): void {
		// Arrow navigation
		if ( this.prevArrow ) {
			this.prevArrow.addEventListener( 'click', () => this.prev() );
		}

		// TODO: Add comment.
		if ( this.nextArrow ) {
			this.nextArrow.addEventListener( 'click', () => this.next() );
		}

		// Nav item clicks
		if ( this.navItems ) {
			this.navItems.forEach( ( item, index ) => {
				item.addEventListener( 'click', () => this.goToSlide( index ) );
			} );
		}

		// Swipe handlers
		this.updateSwipeHandlers();

		// Window resize handler
		window.addEventListener( 'resize', this.handleResize.bind( this ) );
	}

	// Remove event listeners
	private removeEventListeners(): void {
		window.removeEventListener( 'resize', this.handleResize.bind( this ) );

		// Remove swipe handlers
		if ( this.slidesContainer ) {
			this.slidesContainer.removeEventListener( 'touchstart', this.handleTouchStart.bind( this ) );
			this.slidesContainer.removeEventListener( 'touchend', this.handleTouchEnd.bind( this ) );
		}
	}

	// Handle window resize
	private handleResize(): void {
		this.applyResponsiveSettings();
		this.updateSliderState();
	}

	// Update swipe handlers
	private updateSwipeHandlers(): void {
		if ( ! this.slidesContainer ) {
			return;
		}

		// Remove existing listeners to avoid duplicates
		this.slidesContainer.removeEventListener( 'touchstart', this.handleTouchStart.bind( this ) );
		this.slidesContainer.removeEventListener( 'touchend', this.handleTouchEnd.bind( this ) );

		// Add new listeners if swipe is enabled
		if ( this.swipeEnabled ) {
			this.slidesContainer.addEventListener( 'touchstart', this.handleTouchStart.bind( this ), { passive: true } );
			this.slidesContainer.addEventListener( 'touchend', this.handleTouchEnd.bind( this ) );
		}
	}

	// Handle touch start
	private handleTouchStart( e: TouchEvent ): void {
		this.touchStartX = e.changedTouches[ 0 ].screenX;
	}

	// Handle touch end
	private handleTouchEnd( e: TouchEvent ): void {
		this.touchEndX = e.changedTouches[ 0 ].screenX;
		this.handleSwipe();
	}

	// Handle swipe gesture
	private handleSwipe(): void {
		const swipeDistance = this.touchEndX - this.touchStartX;

		// TODO: Add comment.
		if ( Math.abs( swipeDistance ) < this.swipeThreshold ) {
			return;
		}

		// TODO: Add comment.
		if ( swipeDistance < 0 ) {
			// Swipe left - go next
			this.next();
		} else {
			// Swipe right - go previous
			this.prev();
		}
	}

	// Set up auto-play
	private setupAutoPlay(): void {
		// Clear existing interval
		if ( this.autoPlayInterval ) {
			clearInterval( this.autoPlayInterval );
			this.autoPlayInterval = null;
		}

		// Set up new interval if needed
		if ( this.autoSlideInterval > 0 ) {
			this.autoPlayInterval = window.setInterval( () => this.next(), this.autoSlideInterval );

			// Pause on hover
			this.addEventListener( 'mouseenter', () => {
				if ( this.autoPlayInterval ) {
					clearInterval( this.autoPlayInterval );
					this.autoPlayInterval = null;
				}
			} );

			// TODO: Add comment.
			this.addEventListener( 'mouseleave', () => {
				if ( ! this.autoPlayInterval && this.autoSlideInterval > 0 ) {
					this.autoPlayInterval = window.setInterval( () => this.next(), this.autoSlideInterval );
				}
			} );
		}
	}

	// Update slider state based on current settings
	private updateSliderState(): void {
		if ( ! this.slidesContainer || this.slides.length === 0 ) {
			return;
		}

		// Update behaviour-specific styles
		if ( this.behaviour === 'fade' ) {
			// Fade behaviour
			this.slidesContainer.classList.add( 'tp-fade-behaviour' );
			this.slidesContainer.classList.remove( 'tp-slide-behaviour' );

			// Update slide visibility
			this.slides.forEach( ( slide, index ) => {
				slide.classList.toggle( 'active', index === this.currentIndex );
			} );
		} else {
			// Slide behaviour
			this.slidesContainer.classList.add( 'tp-slide-behaviour' );
			this.slidesContainer.classList.remove( 'tp-fade-behaviour' );

			// Set slide width based on perView
			this.slides.forEach( ( slide ) => {
				slide.style.flex = `0 0 calc(100% / ${ this.perView })`;
			} );

			// Position the slides
			this.scrollToSlide( this.currentIndex );
		}

		// Update flexible height
		if ( this.flexibleHeight ) {
			this.track?.classList.add( 'flexible-height' );
		} else {
			this.track?.classList.remove( 'flexible-height' );
		}

		// Update navigation state
		this.updateNavigation();

		// Update count
		this.updateCount();
	}

	// Go to next slide
	public next(): void {
		const newIndex = this.currentIndex + this.step;

		// TODO: Add comment.
		if ( newIndex >= this.slides.length ) {
			if ( this.infiniteScroll ) {
				// Loop back to the beginning
				this.goToSlide( 0 );
			} else {
				// Stay at the last slide
				this.goToSlide( this.slides.length - 1 );
			}
		} else {
			this.goToSlide( newIndex );
		}
	}

	// Go to previous slide
	public prev(): void {
		const newIndex = this.currentIndex - this.step;

		// TODO: Add comment.
		if ( newIndex < 0 ) {
			if ( this.infiniteScroll ) {
				// Loop to the end
				this.goToSlide( this.slides.length - 1 );
			} else {
				// Stay at the first slide
				this.goToSlide( 0 );
			}
		} else {
			this.goToSlide( newIndex );
		}
	}

	// Go to specific slide
	public goToSlide( index: number ): void {
		// Constrain index to valid range
		const safeIndex = Math.max( 0, Math.min( index, this.slides.length - 1 ) );

		// Update current index
		this.currentIndex = safeIndex;

		// Update slides based on behaviour
		if ( this.behaviour === 'fade' ) {
			this.slides.forEach( ( slide, i ) => {
				slide.classList.toggle( 'active', i === this.currentIndex );
			} );
		} else {
			this.scrollToSlide( this.currentIndex );
		}

		// Update navigation
		this.updateNavigation();

		// Update count
		this.updateCount();

		// Dispatch event
		this.dispatchEvent( new CustomEvent( 'slide-change', {
			detail: { index: this.currentIndex },
		} ) );
	}

	// Scroll to specific slide (for slide behaviour)
	private scrollToSlide( index: number ): void {
		if ( ! this.slidesContainer || ! this.slides[ index ] ) {
			return;
		}

		// TODO: Add comment.
		const slideWidth = this.slides[ 0 ].offsetWidth;
		const offset = slideWidth * index;

		// TODO: Add comment.
		this.slidesContainer.style.transform = `translateX(-${ offset }px)`;
	}

	// Update navigation state
	private updateNavigation(): void {
		if ( this.navItems ) {
			this.navItems.forEach( ( item, index ) => {
				item.classList.toggle( 'active', index === this.currentIndex );
			} );
		}
	}

	// Update count element
	private updateCount(): void {
		if ( ! this.countElement ) {
			return;
		}

		// TODO: Add comment.
		const current = this.currentIndex + 1;
		const total = this.slides.length;

		// Update attributes
		this.countElement.setAttribute( 'current', current.toString() );
		this.countElement.setAttribute( 'total', total.toString() );

		// Update content based on format
		const format = this.countElement.getAttribute( 'format' ) || '$current / $total';
		const formattedCount = format
			.replace( '$current', current.toString() )
			.replace( '$total', total.toString() );

		// TODO: Add comment.
		this.countElement.textContent = formattedCount;
	}
}
