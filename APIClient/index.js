import {useAsyncStorage} from "@react-native-async-storage/async-storage";
import {DEFAULT_ERROR_MESSAGE} from "../settings";

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
    const baseHeaders = isMultipartFormData ? (
      {"Content-Type": "multipart/form-data", Access: "application/json"}
    ) : (
      {"Content-Type": "application/json"}
    );
    const { getItem: getJWT } = useAsyncStorage("jwt");
    const jwt = await getJWT();
    return jwt ? (
      { Authorization:  `JWT ${JSON.parse(jwt).access}`, ...baseHeaders}
    ) : (
      baseHeaders
    );
  }

  makeRequestHandleResponse = async (params, requestOptions, validStatusCodes) => {
    try {
      const response = await fetch(params.resource, requestOptions);
      if (!validStatusCodes.includes(response.status) ) {
        const json = await response.json();
        params.errorCallback(json);
        return;
      }
      const json = await response.json();
      params.successCallback(json);
    } catch (error) {
      // TODO - Sentry logging here
      console.error("unknown error @ APIClient.handleResponse: ", error, params);
      params.errorCallback({"unExpectedError": DEFAULT_ERROR_MESSAGE});
    }
  }
}

const client = new APIClient();
export default client;
