/**
 * Utility functions.
 */

/**
 * Slide element down.
 *
 * @param {HTMLElement|null} element  Target element.
 * @param {number}           duration Animation duration.
 * @param {Function}         callback Callback function.
 */
export const slideElementDown = ( element: HTMLElement, duration: number = 300, callback: Function = () => {} ) => { // eslint-disable-line
	// Get element height.
	element.style.height = `${ element.scrollHeight }px`;

	// Set timeout.
	setTimeout( () => {
		// Set element's height.
		element.style.height = 'auto';

		// If callback is available, call the function.
		if ( callback ) {
			callback();
		}
	}, duration );
};

/**
 * Slide element up.
 *
 * @param {HTMLElement|null} element  Target element.
 * @param {number}           duration Animation duration.
 * @param {Function}         callback Callback function.
 */
export const slideElementUp = ( element: HTMLElement, duration: number = 300, callback: Function = () => {} ) => { // eslint-disable-line
	// Get element height.
	element.style.height = `${ element.scrollHeight }px`;
	element.offsetHeight; // eslint-disable-line
	element.style.height = '0px';

	// Set timeout.
	setTimeout( () => {
		// Set element's height.
		element.style.height = '0px';

		// If callback is available, call the function.
		if ( callback ) {
			callback();
		}
	}, duration );
};
