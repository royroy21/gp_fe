import { create } from 'zustand'
import client from "../APIClient";
import {BACKEND_ENDPOINTS} from "../settings";
import updateLocation from "../components/location/updateLocation";

const onSuccess = async (set, json) => {
  set({ object: json, loading: false, error: null })
  updateLocation(json.id);
}

const useUserStore = create((set) => ({
  object: null,
  loading: false,
  error: null,
  me: async () => {
    set({ loading: true });
    const params = {
      resource: BACKEND_ENDPOINTS.me,
      successCallback: (json) => onSuccess(set, json),
      errorCallback: (json) => set({ object: null, loading: false, error: json }),
    }
    await client.get(params);
  },
  patch: async (id, data) => {
    set({ loading: true });
    const params = {
      resource: `${BACKEND_ENDPOINTS.user}${id}/`,
      data: data,
      successCallback: (json) => set({ object: json, loading: false, error: null }),
      errorCallback: (json) => set({ object: null, loading: false, error: json }),
    }
    await client.patch(params);
  },
  clear: () => set({object: null, loading: false, error: null}),
}));

export default useUserStore;
