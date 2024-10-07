/**
 * Styles.
 */
import './style.scss';

/**
 * Components.
 */
import { TPNumberSpinnerInput } from './tp-number-spinner-input';
import { TPNumberSpinnerIncrement } from './tp-number-spinner-increment';
import { TPNumberSpinnerDecrement } from './tp-number-spinner-decrement';
import { TPNumberSpinner } from './tp-number-spinner';

/**
 * Register Components.
 */
customElements.define( 'tp-number-spinner-input', TPNumberSpinnerInput );
customElements.define( 'tp-number-spinner-increment', TPNumberSpinnerIncrement );
customElements.define( 'tp-number-spinner-decrement', TPNumberSpinnerDecrement );
customElements.define( 'tp-number-spinner', TPNumberSpinner );
