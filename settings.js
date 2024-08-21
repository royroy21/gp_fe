// Add a local_settings.js file to import settings used locally not saved to GIT.
const LOCAL_DEVELOPMENT = true;

let BACKEND_DOMAIN;
let LOCAL_BACKEND_URL;
let LOCAL_BACKEND_SOCKET_URL;
let DEBUG;

if (LOCAL_DEVELOPMENT) {
  // LOCAL SETTINGS.
  BACKEND_DOMAIN = "192.168.0.88:8000";
  LOCAL_BACKEND_URL = `http://${BACKEND_DOMAIN}`;
  LOCAL_BACKEND_SOCKET_URL = `ws://${BACKEND_DOMAIN}`;
  DEBUG = true;
} else {
  // DEVELOPMENT SETTINGS
  BACKEND_DOMAIN = "backend.gigpig.fm";
  LOCAL_BACKEND_URL = `https://${BACKEND_DOMAIN}`;
  LOCAL_BACKEND_SOCKET_URL = `wss://${BACKEND_DOMAIN}`;
  DEBUG = false;
}

export { BACKEND_DOMAIN, LOCAL_BACKEND_URL, LOCAL_BACKEND_SOCKET_URL, DEBUG }

// Domain
export const DOMAIN_NAME = 'gigpig.fm'
export const DOMAIN_NAME_WITH_PREFIX = `https://${DOMAIN_NAME}`

// Keys, Ids, access_codes.
// export const EXPO_PROJECT_ID = LOCAL_EXPO_PROJECT_ID;

// GENERAL
export const LOGIN_REQUIRED = false;

// BACKEND RELATED
export const BACKEND_URL = LOCAL_BACKEND_URL;
export const BACKEND_ENDPOINTS = {
  token: BACKEND_URL + "/api/token/",
  refreshToken: BACKEND_URL + "/api/token/refresh/",
  user: BACKEND_URL + "/api/user/",
  me: BACKEND_URL + "/api/user/me/",
  album: BACKEND_URL + "/api/album/",
  track: BACKEND_URL + "/api/audio/",
  gigs: BACKEND_URL + "/api/gig/",
  country: BACKEND_URL + "/api/country/?code=",
  message: BACKEND_URL + "/api/message/",
  resetPassword: BACKEND_URL + "/api/reset-password/",
  resetPasswordRequest: BACKEND_URL + "/api/reset-password-request/",
  room: BACKEND_URL + "/api/room/",
  rooms_with_unread_messages: BACKEND_URL + "/api/room/rooms_with_unread_messages/",
  searchGigs: BACKEND_URL + "/api/gig/search/",
  searchCountries: BACKEND_URL + "/search/country/suggest/?country_suggest__completion=",
  searchGenres: BACKEND_URL + "/search/genre/suggest/?genre_suggest__completion=",
  searchInstruments: BACKEND_URL + "/search/instrument/suggest/?instrument_suggest__completion=",
  searchRooms: BACKEND_URL + "/api/room/search/",
  searchUsers: BACKEND_URL + "/api/user/search/",
};
export const BACKEND_SOCKET_URL = LOCAL_BACKEND_SOCKET_URL;
export const BACKEND_SOCKET_ENDPOINTS = {
  newMessage: BACKEND_SOCKET_URL + "/ws/new_chat/",
  message: BACKEND_SOCKET_URL + "/ws/chat/",
}


// Used if country cannot be obtained from User object.
export const DEFAULT_COUNTRY = {
  country: "United Kingdom",
  code: "UK",
};

// Screen size
// Defines what counts as a small screen for web app.
export const smallScreenWidth = 500;

// Display options
export const ALLOW_LIGHT_THEME_OPTION = false;
export const APOLOGY_PREFIX = "Apologies from GigPig. ";
export const DEFAULT_ERROR_MESSAGE = "An unexpected error has occurred."
export const USE_PUSH_NOTIFICATIONS = false;
