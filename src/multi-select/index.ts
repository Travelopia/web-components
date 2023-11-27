/**
 * Styles.
 */
import './style.scss';

/**
 * Components.
 */
import { TPMultiSelectElement } from './tp-multi-select';
import { TPMultiSelectFieldElement } from './tp-multi-select-field';
import { TPMultiSelectPlaceholderElement } from './tp-multi-select-placeholder';
import { TPMultiSelectStatusElement } from './tp-multi-select-status';
import { TPMultiSelectOptionsElement } from './tp-multi-select-options';
import { TPMultiSelectOptionElement } from './tp-multi-select-option';
import { TPMultiSelectSearchElement } from './tp-multi-select-search';
import { TPMultiSelectPillElement } from './tp-multi-select-pill';
import { TPMultiSelectPillsElement } from './tp-multi-select-pills';

/**
 * Register Components.
 */
customElements.define( 'tp-multi-select', TPMultiSelectElement );
customElements.define( 'tp-multi-select-field', TPMultiSelectFieldElement );
customElements.define( 'tp-multi-select-placeholder', TPMultiSelectPlaceholderElement );
customElements.define( 'tp-multi-select-status', TPMultiSelectStatusElement );
customElements.define( 'tp-multi-select-options', TPMultiSelectOptionsElement );
customElements.define( 'tp-multi-select-option', TPMultiSelectOptionElement );
customElements.define( 'tp-multi-select-search', TPMultiSelectSearchElement );
customElements.define( 'tp-multi-select-pill', TPMultiSelectPillElement );
customElements.define( 'tp-multi-select-pills', TPMultiSelectPillsElement );
