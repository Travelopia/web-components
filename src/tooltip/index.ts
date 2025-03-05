/**
 * Styles.
 */
import './style.scss';

/**
 * Components.
 */
import { TPTooltip } from './tp-tooltip';
import { TPTooltipTrigger } from './tp-tooltip-trigger';

/**
 * Register Components.
 */
customElements.define( 'tp-tooltip', TPTooltip );
customElements.define( 'tp-tooltip-trigger', TPTooltipTrigger );
