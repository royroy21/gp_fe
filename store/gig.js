import { create } from 'zustand'
import client from "../APIClient";
import {BACKEND_ENDPOINTS} from "../settings";

const useGigStore = create((set) => ({
  object: null,
  loading: false,
  error: null,
  store: gig => set({ object: gig, loading: false, error: null }),
  get: async (id, onSuccess = () => {}) => {
    set({ loading: true });
    const params = {
      resource: BACKEND_ENDPOINTS.gigs + id.toString(),
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
      resource: BACKEND_ENDPOINTS.gigs,
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
      resource: BACKEND_ENDPOINTS.gigs + id.toString() + "/",
      data: data,
      successCallback: (json) => {
        set({object: json, loading: false, error: null});
        onSuccess(json);
      },
      errorCallback: (json) => set({ loading: false, error: json }),
    }
    await client.patch(params, isMultipartFormData);
  },
  addFavorite: async (gig_id, onSuccess = () => {}) => {
    set({ loading: true });
    const params = {
      resource: `${BACKEND_ENDPOINTS.user}add-favorite-gig/`,
      data: {id: gig_id},
      successCallback: (json) => {
        set({loading: false, error: null})
        onSuccess(json);
      },
      errorCallback: (json) => set({ loading: false, error: json }),
    }
    await client.post(params);
  },
  removeFavorite: async (gig_id, onSuccess = () => {}) => {
    set({ loading: true });
    const params = {
      resource: `${BACKEND_ENDPOINTS.user}remove-favorite-gig/`,
      data: {id: gig_id},
      successCallback: (json) => {
        set({loading: false, error: null})
        onSuccess(json);
      },
      errorCallback: (json) => set({ loading: false, error: json }),
    }
    await client.post(params);
  },
  clear: () => set({object: null, loading: false, error: null}),
}));

export default useGigStore;
