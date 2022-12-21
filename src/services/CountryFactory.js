import Country from "../objects/Country.js";

export default class CountryFactory {
	/**
	 * Creates a country from the specified country name.
	 * @param {*} imageName The image name of the country.
	 * @returns The created country.
	 */
	static createInstance(imageName) {
		return new Country(imageName);
	}
}
