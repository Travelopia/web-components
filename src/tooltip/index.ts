/**
 * Styles.
 */
import './style.scss';

/**
 * Components.
 */
import { TPTooltip } from './tp-tooltip';
import { TPTooltipTrigger } from './tp-tooltip-trigger';
import { TPTooltipArrow } from './tp-tooltip-arrow';

/**
 * Register Components.
 */
customElements.define( 'tp-tooltip', TPTooltip );
customElements.define( 'tp-tooltip-trigger', TPTooltipTrigger );
customElements.define( 'tp-tooltip-arrow', TPTooltipArrow );
