/**
 * Styles.
 */
import './style.scss';

/**
 * Components.
 */
import { TPTabElement } from './tp-tab';
import { TPTabs } from './tp-tabs';
import { TPTabNavElement } from './tp-tab-nav';
import { TPTabsNavElement } from './tp-tabs-nav';

/**
 * Register Components.
 */
customElements.define( 'tp-tabs', TPTabs );
customElements.define( 'tp-tab', TPTabElement );
customElements.define( 'tp-tab-nav', TPTabNavElement );
customElements.define( 'tp-tabs-nav', TPTabsNavElement );
