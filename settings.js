
// GENERAL
export const LOGIN_REQUIRED = false;

// BACKEND RELATED
export const BACKEND_URL = "http://192.168.196.206:8000"   // for mobile
// export const BACKEND_URL = "http://localhost:8000"   // for web
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
