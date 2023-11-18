/**
 * Components.
 */
import { TPTabElement } from './tp-tab';
import { TPTabs } from './tp-tabs';
import { TPTabsNavElement } from './tp-tabs-nav';

/**
 * Register Components.
 */
customElements.define( 'tp-tabs', TPTabs );
customElements.define( 'tp-tab', TPTabElement );
customElements.define( 'tp-tabs-nav', TPTabsNavElement );
