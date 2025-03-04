/**
 * Styles.
 */
import './style.scss';

/**
 * Components.
 */
import { TPTooltipElement } from './tp-tooltip';
import { TPTooltipArrowElement } from './tp-tooltip-arrow';
import { TPTooltipPopoverElement } from './tp-tooltip-popover';

/**
 * Register Components.
 */
customElements.define( 'tp-tooltip', TPTooltipElement );
customElements.define( 'tp-tooltip-arrow', TPTooltipArrowElement );
customElements.define( 'tp-tooltip-popover', TPTooltipPopoverElement );
