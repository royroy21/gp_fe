// Add a local_settings.js file to import settings used locally not saved to GIT.
import {BACKEND_URL as LOCAL_BACKEND_URL} from "./local_settings";
import {BACKEND_SOCKET_URL as LOCAL_BACKEND_SOCKET_URL} from "./local_settings";
import {EXPO_PROJECT_ID as LOCAL_EXPO_PROJECT_ID} from "./local_settings";

// Keys, Ids, access_codes..
export const EXPO_PROJECT_ID = LOCAL_EXPO_PROJECT_ID;

// GENERAL
export const LOGIN_REQUIRED = false;

// BACKEND RELATED
export const BACKEND_URL = LOCAL_BACKEND_URL;
export const BACKEND_ENDPOINTS = {
  token: BACKEND_URL + "/api/token/",
  user: BACKEND_URL + "/api/user/",
  me: BACKEND_URL + "/api/user/me/",
  gigs: BACKEND_URL + "/api/gig/",
  country: BACKEND_URL + "/api/country/?code=",
  message: BACKEND_URL + "/api/message/",
  room: BACKEND_URL + "/api/room/",
  searchGigs: BACKEND_URL + "/search/gig/",
  searchCountries: BACKEND_URL + "/search/country/suggest/?country_suggest__completion=",
  searchGenres: BACKEND_URL + "/search/genre/suggest/?genre_suggest__completion=",
  searchUsers: BACKEND_URL + "/search/user/",
};
export const BACKEND_SOCKET_URL = LOCAL_BACKEND_SOCKET_URL;
export const BACKEND_SOCKET_ENDPOINTS = {
  newMessage: BACKEND_SOCKET_URL + "/ws/new_chat/",
  message: BACKEND_SOCKET_URL + "/ws/chat/",
}


// Used if country cannot be obtained from User object.
// TODO - currently not being used :/
export const DEFAULT_COUNTRY_CODE = "GB";

export const DEFAULT_ERROR_MESSAGE = "Sorry an unexpected error has occurred."
