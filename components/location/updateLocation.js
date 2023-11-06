import * as Location from 'expo-location';
import {BACKEND_ENDPOINTS} from "../../settings";
import client from "../../APIClient";

async function updateLocation(userId) {
  // Sends a user's location to be saved at the backend.
  // Note: Location.reverseGeocodeAsync can be used to get location
  // data based upon latitude and longitude.
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== "granted") {
    // TODO - replace with sentry warning?
    console.log('Permission to access location was denied');
    return;
  }
  const location = await Location.getCurrentPositionAsync({});
  const reversed = await Location.reverseGeocodeAsync(location.coords)
  const rawCountryCode = reversed[0].isoCountryCode
  const countryCode = rawCountryCode === "GB" ? "UK" : rawCountryCode;

  const params = {
    resource: `${BACKEND_ENDPOINTS.user}${userId}/`,
    successCallback: () => console.log("Successfully updated user's location with country", countryCode),
    // TODO - Log this as sentry?
    errorCallback: (json) => console.log(
      `error with countryCode ${countryCode} @updateLocation`, JSON.stringify(json)
    ),
    data: {
      location: {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      },
      country: {
        code: countryCode,
      }
    },
  }
  await client.put(params);
}

export default updateLocation;
