/**
 * Styles.
 */
import './style.scss';

/**
 * Components.
 */
import { TPCarouselElement } from './tp-carousel';
import { TPCarouselTrackElement } from './tp-carousel-track';
import { TPCarouselSlidesElement } from './tp-carousel-slides';
import { TPCarouselSlideElement } from './tp-carousel-slide';
import { TPCarouselArrowElement } from './tp-carousel-arrow';

/**
 * Register Components.
 */
customElements.define( 'tp-carousel', TPCarouselElement );
customElements.define( 'tp-carousel-track', TPCarouselTrackElement );
customElements.define( 'tp-carousel-slides', TPCarouselSlidesElement );
customElements.define( 'tp-carousel-slide', TPCarouselSlideElement );
customElements.define( 'tp-carousel-arrow', TPCarouselArrowElement );
