import { create } from 'zustand'
import client from "../APIClient";
import {BACKEND_ENDPOINTS} from "../settings";

const useCountryStore = create((set) => ({
  object: null,
  loading: false,
  error: null,
  get: async (user, onSuccess) => {
    if (!(user && user.country)) {
      return
    }
    set({ loading: true });
    const params = {
      resource: BACKEND_ENDPOINTS.country + user.country.code,
      successCallback: (json) => {
        set({object: json, loading: false, error: null});
        onSuccess("country", {defaultValue: json});
      },
      errorCallback: (json) => set({ object: null, loading: false, error: json }),
    }
    await client.get(params);
  },
}));

export default useCountryStore;
