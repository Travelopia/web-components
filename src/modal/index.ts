/**
 * Styles.
 */
import './style.scss';

/**
 * Components.
 */
import { TPModalElement } from './tp-modal';
import { TPModalCloseElement } from './tp-modal-close';

/**
 * Register Components.
 */
customElements.define( 'tp-modal', TPModalElement );
customElements.define( 'tp-modal-close', TPModalCloseElement );
