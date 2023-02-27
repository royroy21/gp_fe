import client from "../../APIClient";
import {useAsyncStorage} from "@react-native-async-storage/async-storage";
import mergeListsOfObjects from "../../helpers/mergeLists";

async function getGigs(url, setGigs, previousGigs, doNotMergeResults=false) {
  const { getItem: getJWT } = useAsyncStorage("jwt");
  const jwt = await getJWT();
  const params = {
    resource: url,
    jwt: JSON.parse(jwt).access,
    successCallback: (json) => {
      if (doNotMergeResults) {
        setGigs(json);
      }
      else if (previousGigs.length > 0) {
        json.results = mergeListsOfObjects(previousGigs, json.results);
        setGigs(json);
      } else {
        setGigs(json);
      }
    },
    // TODO - handle error.
    // Probably token is out of date so implement refresh token logic here.
    errorCallback: (json) => console.log("error @ api/gig: ", params, JSON.stringify(json)),
  }
  await client.get(params);
}

export default getGigs;
