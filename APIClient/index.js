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
        params.errorCallback(json);
        return;
      }
      if (responseWithoutJSON) {
        // For responses that do not contain JSON.
        // For example if deleting we get 204
        // response without content.
        params.successCallback();
      } else {
        const json = await response.json();
        params.successCallback(json);
      }
    } catch (error) {
      // TODO - Sentry logging here
      console.error("unknown error @ APIClient.handleResponse: ", error, params);
      params.errorCallback({"unExpectedError": DEFAULT_ERROR_MESSAGE});
    }
  }
}

const client = new APIClient();
export default client;
