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
import { TPSliderNavElement } from './tp-slider-nav';
import { TPSliderNavItemElement } from './tp-slider-nav-item';
import { TPSliderCountElement } from './tp-slider-count';

/**
 * Register Components.
 */
customElements.define( 'tp-slider', TPSliderElement );
customElements.define( 'tp-slider-count', TPSliderCountElement );
customElements.define( 'tp-slider-track', TPSliderTrackElement );
customElements.define( 'tp-slider-slides', TPSliderSlidesElement );
customElements.define( 'tp-slider-slide', TPSliderSlideElement );
customElements.define( 'tp-slider-arrow', TPSliderArrowElement );
customElements.define( 'tp-slider-nav', TPSliderNavElement );
customElements.define( 'tp-slider-nav-item', TPSliderNavItemElement );
