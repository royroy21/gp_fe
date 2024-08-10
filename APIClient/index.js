import AsyncStorage, {useAsyncStorage} from "@react-native-async-storage/async-storage";
import {APOLOGY_PREFIX, BACKEND_ENDPOINTS, DEBUG, DEFAULT_ERROR_MESSAGE} from "../settings";
import useJWTStore from "../store/jwt";
import {Platform} from "react-native";
import clearAll from "../store/clearAll";
import {closeAndDeleteOtherWebSockets} from "../components/message";

const TIMEOUT_MS = 10000;

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
      const response = await this.getResponse(params.resource, requestOptions);
      if (!validStatusCodes.includes(response.status) ) {
        const json = await response.json();

        // Checking params.resource is not BACKEND_ENDPOINTS.refreshToken
        // so to stop an infinite loop from happening.
        // If this is the case the error block should hit.
        if (response.status === 401 && json.code === "token_not_valid" && params.resource !== BACKEND_ENDPOINTS.refreshToken) {
          DEBUG && console.log("token_not_valid. Attempting to refresh JWT.");
          return await this.refreshJWT(params, requestOptions, validStatusCodes, responseWithoutJSON);
        }

        params.errorCallback(json);
        return;
      }
      if (responseWithoutJSON) {
        // For responses that do not contain JSON.
        // For example if deleting we get 204 response without content.
        if (params.successCallback.hasOwnProperty('async') && params.successCallback.async === true) {
          await params.successCallback();
        } else {
          params.successCallback();
        }
      } else {
        const json = await response.json();
        if (params.successCallback.hasOwnProperty('async') && params.successCallback.async === true) {
          await params.successCallback(json);
        } else {
          params.successCallback(json);
        }
      }
    } catch (error) {
      DEBUG && console.log(`API ERROR: "${error.message}"`, params);
      switch(error.message) {
        case "The user aborted a request.":
          return params.errorCallback({"unExpectedError": APOLOGY_PREFIX + "The request timed out."});
        case "Network request failed":
          return params.errorCallback({"unExpectedError": APOLOGY_PREFIX + "Network request failed."});
        default:
          return params.errorCallback({"unExpectedError": APOLOGY_PREFIX + DEFAULT_ERROR_MESSAGE});
      }
    }
  }

  getResponse = async (resourceURL, requestOptions) => {
    const isWeb = Boolean(Platform.OS === "web");
    // Different abort signals are needed for web vs mobile.
    // AbortSignal.timeout doesn't work with React Native.
    if (isWeb) {
      return await fetch(resourceURL, {
        signal: AbortSignal.timeout( TIMEOUT_MS ), ...requestOptions,
      });
    } else {  // Assume is mobile.
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("The user aborted a request.")), TIMEOUT_MS)
      );
      return await Promise.race([
        fetch(resourceURL, requestOptions),
        timeoutPromise,
      ]);
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

    const onSuccess = async json => {
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
    const onError = () => {
      AsyncStorage.clear();
      clearAll();
      closeAndDeleteOtherWebSockets();
      params.errorCallback(errorMessage);
    }

    const refreshTokenParams = {
      resource: BACKEND_ENDPOINTS.refreshToken,
      data: {refresh: refreshToken},
      successCallback: json => onSuccess(json),
      errorCallback: () => onError(),
    }
    DEBUG && console.log("Refreshing JWT with refresh token params:", refreshTokenParams);
    await this.post(refreshTokenParams);
  }
}

const client = new APIClient();
export default client;
