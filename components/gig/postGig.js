import {useAsyncStorage} from "@react-native-async-storage/async-storage";
import client from "../../APIClient";
import {BACKEND_ENDPOINTS} from "../../settings";

async function postGigs(data, setResponse, setError) {
  const { getItem: getJWT } = useAsyncStorage("jwt");
  const jwt = await getJWT();
  const params = {
    resource: BACKEND_ENDPOINTS.gigs,
    data: data,
    jwt: JSON.parse(jwt).access,
    successCallback: (json) => {
      setResponse(json)
    },
    errorCallback: (json) => {
      setError(json)
    },
  }
  await client.post(params);
}

export default postGigs;
