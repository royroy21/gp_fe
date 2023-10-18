import { create } from 'zustand'
import client from "../APIClient";
import {BACKEND_ENDPOINTS} from "../settings";

const useTrackStore = create((set) => ({
  object: null,
  loading: false,
  error: null,
  get: async (id, onSuccess = () => {}) => {
    set({ loading: true });
    const params = {
      resource: BACKEND_ENDPOINTS.track + id.toString(),
      successCallback: (json) => {
        set({object: json, loading: false, error: null})
        onSuccess(json);
      },
      errorCallback: (json) => set({ loading: false, error: json }),
    }
    await client.get(params);
  },
  post: async (data, onSuccess, isMultipartFormData=false) => {
    set({ loading: true });
    const params = {
      resource: BACKEND_ENDPOINTS.track,
      data: data,
      successCallback: (json) => {
        set({object: json, loading: false, error: null})
        onSuccess(json);
      },
      errorCallback: (json) => set({ loading: false, error: json }),
    }
    await client.post(params, isMultipartFormData);
  },
  patch: async (id, data, onSuccess, isMultipartFormData=false) => {
    set({ loading: true });
    const params = {
      resource: BACKEND_ENDPOINTS.track + id.toString() + "/",
      data: data,
      successCallback: (json) => {
        set({object: json, loading: false, error: null});
        onSuccess(json);
      },
      errorCallback: (json) => set({ loading: false, error: json }),
    }
    await client.patch(params, isMultipartFormData);
  },
  delete: async (id, onSuccess) => {
    set({ loading: true });
    const params = {
      resource: BACKEND_ENDPOINTS.track + id.toString() + "/",
      successCallback: (json) => {
        set({object: json, loading: false, error: null});
        onSuccess();
      },
      errorCallback: (json) => set({ loading: false, error: json }),
    }
    await client.delete(params);
  },
  clear: () => set({object: null, loading: false, error: null}),
}));

export default useTrackStore;
