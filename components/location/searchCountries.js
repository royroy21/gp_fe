import client from "../../APIClient";
import {BACKEND_ENDPOINTS} from "../../settings";

async function searchCountries(query, setCountries) {
  const params = {
    resource: BACKEND_ENDPOINTS.searchCountries + query,
    successCallback: (json) => {
      setCountries(json)
    },
    // TODO - handle error.
    errorCallback: (json) => console.log(
      "error @ search/country/suggest/: ", params, JSON.stringify(json)
    ),
  }
  await client.get(params);
}

export default searchCountries;
