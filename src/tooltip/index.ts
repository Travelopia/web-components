/**
 * Styles.
 */
import './style.scss';

/**
 * Components.
 */
import { TPTooltipElement } from './tp-tooltip';
import { TPTooltipTriggerElement } from './tp-tooltip-trigger';
import { TPTooltipPopoverElement } from './tp-tooltip-popover';


/**
 * Register Components.
 */

customElements.define( 'tp-tooltip', TPTooltipElement );
customElements.define( 'tp-tooltip-trigger', TPTooltipTriggerElement );
customElements.define( 'tp-tooltip-popover', TPTooltipPopoverElement );