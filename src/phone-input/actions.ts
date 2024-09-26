import countries, { Country } from "./data";

/**
 * Get countries date.
 *
 * @return {Country} Array Country Object.
 */
export const getCountries = (): Country[] => {
    // return countries data.
	return countries;
};
