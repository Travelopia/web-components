/**
 * Styles.
 */
import './style.scss';

/**
 * Components.
 */
import { TPTabsNavItemElement } from './tp-tabs-nav-item';
import { TPTabsNavElement } from './tp-tabs-nav';
import { TPTabsTabElement } from './tp-tabs-tab';
import { TPTabsElement } from './tp-tabs';

/**
 * Register Components.
 */

// Register parent first so children can find it during their constructor.
customElements.define( 'tp-tabs', TPTabsElement );
customElements.define( 'tp-tabs-nav', TPTabsNavElement );
customElements.define( 'tp-tabs-nav-item', TPTabsNavItemElement );
customElements.define( 'tp-tabs-tab', TPTabsTabElement );
