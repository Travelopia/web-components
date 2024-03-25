/**
 * Styles.
 */
import './style.scss';

/**
 * Components.
 */
import { TPLightboxElement } from './tp-lightbox';
import { TPLightboxContentElement } from './tp-lightbox-content';
import { TPLightboxCloseElement } from './tp-lightbox-close';
import { TPLightboxPreviousElement } from './tp-lightbox-previous';
import { TPLightboxNextElement } from './tp-lightbox-next';
import { TPLightboxTriggerElement } from './tp-lightbox-trigger';

/**
 * Register Components.
 */
customElements.define( 'tp-lightbox', TPLightboxElement );
customElements.define( 'tp-lightbox-content', TPLightboxContentElement );
customElements.define( 'tp-lightbox-close', TPLightboxCloseElement );
customElements.define( 'tp-lightbox-previous', TPLightboxPreviousElement );
customElements.define( 'tp-lightbox-next', TPLightboxNextElement );
customElements.define( 'tp-lightbox-trigger', TPLightboxTriggerElement );
