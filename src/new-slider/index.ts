/**
 * index.ts - Main entry point for registering all components
 */
import './style.scss';

// Import all component classes
import { TPSlider } from './tp-slider';
import { TPSliderTrack, TPSliderSlides, TPSliderSlide, TPSliderArrow, TPSliderNav, TPSliderNavItem, TPSliderCount } from './slider-components';

// Register all custom elements
customElements.define( 'tp-slider', TPSlider );
customElements.define( 'tp-slider-track', TPSliderTrack );
customElements.define( 'tp-slider-slides', TPSliderSlides );
customElements.define( 'tp-slider-slide', TPSliderSlide );
customElements.define( 'tp-slider-arrow', TPSliderArrow );
customElements.define( 'tp-slider-nav', TPSliderNav );
customElements.define( 'tp-slider-nav-item', TPSliderNavItem );
customElements.define( 'tp-slider-count', TPSliderCount );
