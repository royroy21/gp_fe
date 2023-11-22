import AsyncStorage, {useAsyncStorage} from "@react-native-async-storage/async-storage";
import {BACKEND_ENDPOINTS, DEBUG, DEFAULT_ERROR_MESSAGE} from "../settings";
import useJWTStore from "../store/jwt";

const defaultParams = {
  resource: "",
  successCallback: () => {},
  errorCallback: () => {},
}

class APIClient {
  get = async (params=defaultParams) => {
    const headers = await this.getHeaders();
    const requestOptions = {
      method: "GET",
      headers: headers,
    }
    await this.makeRequestHandleResponse(params, requestOptions, [200]);
  };

  delete = async (params=defaultParams) => {
    const headers = await this.getHeaders();
    const requestOptions = {
      method: "DELETE",
      headers: headers,
    }
    await this.makeRequestHandleResponse(
      params, requestOptions, [204], true,
    );
  };

  post = async (params=defaultParams, isMultipartFormData=false) => {
    const headers = await this.getHeaders(isMultipartFormData);
    const requestOptions = {
      method: "POST",
      headers: headers,
      // If isMultipartFormData using FormData so no need to stringify.
      body: isMultipartFormData ? params.data : JSON.stringify(params.data),
    }
    await this.makeRequestHandleResponse(params, requestOptions, [200, 201]);
  }

  put = async (params=defaultParams, isMultipartFormData=false) => {
    const headers = await this.getHeaders(isMultipartFormData);
    const requestOptions = {
      method: "PUT",
      headers: headers,
      // If isMultipartFormData using FormData so no need to stringify.
      body: isMultipartFormData ? params.data : JSON.stringify(params.data),
    }
    await this.makeRequestHandleResponse(params, requestOptions, [200]);
  }

  patch = async (params=defaultParams, isMultipartFormData=false) => {
    const headers = await this.getHeaders(isMultipartFormData);
    const requestOptions = {
      method: "PATCH",
      headers: headers,
      // If isMultipartFormData using FormData so no need to stringify.
      body: isMultipartFormData ? params.data : JSON.stringify(params.data),
    }
    await this.makeRequestHandleResponse(params, requestOptions, [200]);
  }

  getHeaders = async (isMultipartFormData=false) => {
    // if isMultipartFormData is true data will be sent
    // using formData which automatically sets headers.
    const baseHeaders = isMultipartFormData ? {} : {"Content-Type": "application/json"};
    const { getItem: getJWT } = useAsyncStorage("jwt");
    const jwt = await getJWT();
    return jwt ? (
      { Authorization:  `JWT ${JSON.parse(jwt).access}`, ...baseHeaders}
    ) : (
      baseHeaders
    );
  }

  makeRequestHandleResponse = async (
      params, requestOptions, validStatusCodes, responseWithoutJSON=false
  ) => {
    try {
      const response = await fetch(params.resource, requestOptions);
      if (!validStatusCodes.includes(response.status) ) {
        const json = await response.json();

        if (response.status === 401 && json.code === "token_not_valid") {
          DEBUG && console.log("token_not_valid. Attempting to refresh JWT.");
          return await this.refreshJWT(params, requestOptions, validStatusCodes, responseWithoutJSON);
        }

        params.errorCallback(json);
        return;
      }
      if (responseWithoutJSON) {
        // For responses that do not contain JSON.
        // For example if deleting we get 204 response without content.
        params.successCallback();
      } else {
        const json = await response.json();
        params.successCallback(json);
      }
    } catch (error) {
      // TODO - Sentry logging here
      DEBUG && console.error("unknown error @ APIClient.handleResponse: ", error, params);
      params.errorCallback({"unExpectedError": DEFAULT_ERROR_MESSAGE});
    }
  }

  refreshJWT = async (params, requestOptions, validStatusCodes, responseWithoutJSON) => {
    /**
     * Using the JWT refresh token this sends a request to get a new JWT access and refresh token.
     * These are stored in Zustand storage and AsyncStorage then the original request is remade.
     */
    const jwt = useJWTStore.getState().object;
    const errorMessage = {
      "unExpectedError": "Sorry there was a problem authenticating you.",
    };
    if (!jwt) {
      return params.errorCallback(errorMessage);
    }
    const refreshToken = JSON.parse(jwt).refresh;
    const setJWTState = useJWTStore.setState;

    const onSuccess = async (json, setJWTState) => {
      DEBUG && console.log("Deleting old JWT.");
      await AsyncStorage.removeItem("jwt");
      const { setItem: setJWTToAsyncStorage } = useAsyncStorage("jwt");

      DEBUG && console.log("Settings new JWT:", json);
      const jwtAsString = JSON.stringify(json);
      await setJWTToAsyncStorage(jwtAsString);
      setJWTState({ object: jwtAsString, loading: false, error: null });

      // Redo original request.
      requestOptions.headers = await this.getHeaders();
      DEBUG && console.log("Redoing original request:", params, requestOptions);
      await this.makeRequestHandleResponse(params, requestOptions, validStatusCodes, responseWithoutJSON);
    }
    const onError = setJWTState => {
      setJWTState({ loading: false, error: null });
      params.errorCallback(errorMessage);
    }

    const refreshTokenParams = {
      resource: BACKEND_ENDPOINTS.refreshToken,
      data: {refresh: refreshToken},
      successCallback: json => onSuccess(json, setJWTState),
      errorCallback: () => onError(setJWTState),
    }
    DEBUG && console.log("Refreshing JWT with refresh token params:", refreshTokenParams);
    await this.post(refreshTokenParams);
  }
}

const client = new APIClient();
export default client;
