import client from "../../APIClient";
import {BACKEND_ENDPOINTS} from "../../settings";

async function getCountry(countryCode, setCountry) {
  const params = {
    resource: BACKEND_ENDPOINTS.country + countryCode,
    successCallback: (json) => {
      setCountry(json)
    },
    // TODO - handle error.
    errorCallback: (json) => console.log("error @ api/country: ", params, JSON.stringify(json)),
  }
  await client.get(params);
}

export default getCountry;
