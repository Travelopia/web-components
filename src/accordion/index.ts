/**
 * Styles.
 */
import './style.scss';

/**
 * Components.
 */
import { TPAccordionElement } from './tp-accordion';
import { TPAccordionContentElement } from './tp-accordion-content';
import { TPAccordionHandleElement } from './tp-accordion-handle';
import { TPAccordionCollapseAllElement } from './tp-accordion-collapse-all';
import { TPAccordionExpandAllElement } from './tp-accordion-expand-all';
import { TPAccordionItemElement } from './tp-accordion-item';

/**
 * Initialize.
 */
customElements.define( 'tp-accordion', TPAccordionElement );
customElements.define( 'tp-accordion-content', TPAccordionContentElement );
customElements.define( 'tp-accordion-handle', TPAccordionHandleElement );
customElements.define( 'tp-accordion-collapse-all', TPAccordionCollapseAllElement );
customElements.define( 'tp-accordion-expand-all', TPAccordionExpandAllElement );
customElements.define( 'tp-accordion-item', TPAccordionItemElement );
