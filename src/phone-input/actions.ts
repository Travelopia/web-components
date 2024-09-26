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

/**
 * Filter countries date.
 *
 * @param {string} keyword Search keyword.
 * @return {Country} Array Country Object.
 */
export const filterCountries = ( keyword: string ): Country[] => {
    if ( ! keyword ) {
        return countries;
    }

    // Let makes the query serach to lowercase.
    const query = keyword.toLowerCase();
    const filteredCountries = countries.filter( country =>
        country.name.toLowerCase().includes( query ) ||
        country.code.toLowerCase().includes( query )
    );

    // return filtered countries data.
	return filteredCountries;
};
