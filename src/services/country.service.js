import api from "./api";
const API_URL = "all";
class CountryService {
  getCountries(params, searchProperty) {
    return api.get(
      searchProperty && searchProperty.searchParam
        ? `${searchProperty.searchBy}/${searchProperty.searchParam}`
        : API_URL,
      {
        params: params,
      }
    );
  }
  getCountryByName(name, params) {
    return api.get(`name/${name}`, {
      params: params,
    });
  }
}
export default new CountryService();
