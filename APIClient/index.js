// For BE ipaddress: hostname -I
const BACKEND_URL = "http://192.168.1.5:8000/api/"
// const BACKEND_URL = "http://192.168.0.88:8000/api/"

const defaultParams = {
  resource: "",
  jwt: "",
  successCallback: () => {},
  errorCallback: () => {},
}

class APIClient {
  get = async (params=defaultParams) => {
    const requestOptions = {
      method: "GET",
      headers: this.getHeaders(params.jwt),
    }
    await this.handleResponse(params, requestOptions, [200]);
  };

  post = async (params=defaultParams) => {
    const requestOptions = {
      method: "POST",
      headers: this.getHeaders(params.jwt),
      body: JSON.stringify(params.data)
    }
    await this.handleResponse(params, requestOptions, [200, 201]);
  }

  getHeaders (jwt=null) {
    return jwt ? (
      { "Content-Type": "application/json", "Authorization":  `JWT ${jwt}`}
    ) : (
      { "Content-Type": "application/json"}
    );
  }

  handleResponse = async (params, requestOptions, validStatusCodes) => {
    try {
      const response = await fetch(`${BACKEND_URL}${params.resource}/`, requestOptions);
      if (!validStatusCodes.includes(response.status) ) {
        const json = await response.json();
        params.errorCallback(json);
        return;
      }
      const json = await response.json();
      params.successCallback(json);
    } catch (error) {
      // TODO - Sentry logging here
      console.error("unknown error @ APIClient.handleResponse: ", error);
      params.errorCallback({"unExpectedError": "Sorry an unexpected error has occurred."});
    }
  }
}

const client = new APIClient();
export default client;
