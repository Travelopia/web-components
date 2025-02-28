/**
 * Styles.
 */
import './style.scss';

/**
 * Components.
 */
import { TPSliderElement } from './tp-slider';
import { TPSliderTrackElement } from './tp-slider-track';
import { TPSliderSlidesElement } from './tp-slider-slides';
import { TPSliderSlideElement } from './tp-slider-slide';
import { TPSliderArrowElement } from './tp-slider-arrow';

/**
 * Register Components.
 */
customElements.define( 'tp-slider', TPSliderElement );
customElements.define( 'tp-slider-track', TPSliderTrackElement );
customElements.define( 'tp-slider-slides', TPSliderSlidesElement );
customElements.define( 'tp-slider-slide', TPSliderSlideElement );
customElements.define( 'tp-slider-arrow', TPSliderArrowElement );
