import {BACKEND_ENDPOINTS} from "../settings";
import updateLocation from "../components/location/updateLocation";
import client from "../APIClient";

const getUserFromBackend = async (jwt, setUserToLocalStorage) => {
  const params = {
    resource: BACKEND_ENDPOINTS.me,
    jwt: jwt.access,
    successCallback: (json) => {
      setUserToLocalStorage(json)
      updateLocation(json.id, jwt);
    },
    // TODO - handle error.
    // Probably token is out of date so implement refresh token logic here.
    errorCallback: (json) => console.log("error @ user/me: ", JSON.stringify(json)),
  }
  await client.get(params);
}

export default getUserFromBackend;
