/**
 * Styles.
 */
import './style.scss';

/**
 * Components
 */
import { TPLightboxElement } from './tp-lightbox';
import { TPLightboxTriggerElement } from './tp-lightbox-trigger';
import { TPLightboxGalleryElement } from './tp-lightbox-gallery';
import { TPLightboxSliderTrackElement } from './tp-lightbox-slider-track';
import { TPLightboxSliderElement } from './tp-lightbox-slider';
import { TPLightboxSlideElement } from './tp-lightbox-slide';
import { TPLightboxNavElement } from './tp-lightbox-nav';
import { TPLightboxNavButtonElement } from './tp-lightbox-nav-button';
import { TPLightboxCounterElement } from './tp-lightbox-counter';
import { TPLightboxCloseElement } from './tp-lightbox-close';

/**
 * Register Components
 */
customElements.define( 'tp-lightbox', TPLightboxElement );
customElements.define( 'tp-lightbox-trigger', TPLightboxTriggerElement );
customElements.define( 'tp-lightbox-gallery', TPLightboxGalleryElement );
customElements.define( 'tp-lightbox-slider-track', TPLightboxSliderTrackElement );
customElements.define( 'tp-lightbox-slider', TPLightboxSliderElement );
customElements.define( 'tp-lightbox-slide', TPLightboxSlideElement );
customElements.define( 'tp-lightbox-nav', TPLightboxNavElement );
customElements.define( 'tp-lightbox-nav-button', TPLightboxNavButtonElement );
customElements.define( 'tp-lightbox-counter', TPLightboxCounterElement );
customElements.define( 'tp-lightbox-close', TPLightboxCloseElement );
