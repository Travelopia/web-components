/**
 * Styles.
 */
import './style.scss';

/**
 * Components.
 */
import { TPAccordionsElement } from './tp-accordions';
import { TPAccordionsAccordionContentElement } from './tp-accordions-accordion-content';
import { TPAccordionsAccordionHandleElement } from './tp-accordions-accordion-handle';
import { TPAccordionsCollapseAllElement } from './tp-accordions-collapse-all';
import { TPAccordionsExpandAllElement } from './tp-accordions-expand-all';
import { TPAccordionsAccordionElement } from './tp-accordions-accordion';

customElements.define( 'tp-accordions', TPAccordionsElement );
customElements.define( 'tp-accordions-accordion-content', TPAccordionsAccordionContentElement );
customElements.define( 'tp-accordions-accordion-handle', TPAccordionsAccordionHandleElement );
customElements.define( 'tp-accordions-collapse-all', TPAccordionsCollapseAllElement );
customElements.define( 'tp-accordions-expand-all', TPAccordionsExpandAllElement );
customElements.define( 'tp-accordions-accordion', TPAccordionsAccordionElement );
