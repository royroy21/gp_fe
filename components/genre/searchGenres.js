import client from "../../APIClient";
import {BACKEND_ENDPOINTS} from "../../settings";

async function searchGenres(query, setGenres) {
  const params = {
    resource: BACKEND_ENDPOINTS.searchGenres + query,
    successCallback: (json) => {
      setGenres(json)
    },
    // TODO - handle error.
    errorCallback: (json) => console.log(
      "error @ search/genre/suggest/: ", params, JSON.stringify(json)
    ),
  }
  await client.get(params);
}

export default searchGenres;
