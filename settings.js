// Add a local_settings.js file to import settings used locally not saved to GIT.
import {BACKEND_URL as LOCAL_BACKEND_URL} from "./local_settings";

// GENERAL
export const LOGIN_REQUIRED = false;

// BACKEND RELATED
export const BACKEND_URL = LOCAL_BACKEND_URL;
export const BACKEND_ENDPOINTS = {
  token: BACKEND_URL + "/api/token/",
  me: BACKEND_URL + "/api/user/me/",
  user: BACKEND_URL + "/api/user/",
  gigs: BACKEND_URL + "/api/gig/",
  country: BACKEND_URL + "/api/country/?code=",
  searchGigs: BACKEND_URL + "/search/gig/",
  searchCountries: BACKEND_URL + "/search/country/suggest/?country_suggest__completion=",
  searchGenres: BACKEND_URL + "/search/genre/suggest/?genre_suggest__completion="
};

// Used if country cannot be obtained from User object.
export const DEFAULT_COUNTRY_CODE = "GB";
