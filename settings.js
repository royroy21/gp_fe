
// GENERAL
export const LOGIN_REQUIRED = false;

// BACKEND RELATED
export const BACKEND_URL = "http://192.168.211.206:8000"   // for mobile
// export const BACKEND_URL = "http://localhost:8000"   // for web
export const BACKEND_ENDPOINTS = {
  me: BACKEND_URL + "/api/user/me/",
  user: BACKEND_URL + "/api/user/",
  token: BACKEND_URL + "/api/token/",
  gigs: BACKEND_URL + "/api/gig/",
  searchGigs: BACKEND_URL + "/search/gig/",
};
