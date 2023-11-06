import { create } from 'zustand'
import client from "../APIClient";
import {BACKEND_ENDPOINTS} from "../settings";

const useRoomStore = create((set) => ({
  object: null,
  loading: false,
  error: null,
  store: room => set({ object: room, loading: false, error: null }),
  get: async (id, onSuccess = () => {}) => {
    set({ loading: true });
    const params = {
      resource: BACKEND_ENDPOINTS.room + id.toString() + "/",
      successCallback: (json) => {
        set({object: json, loading: false, error: null})
        onSuccess(json);
      },
      errorCallback: (json) => set({ loading: false, error: json }),
    }
    await client.get(params);
  },
  patch: async (id, data, onSuccess) => {
    set({ loading: true });
    const params = {
      resource: BACKEND_ENDPOINTS.room + id.toString() + "/",
      data: data,
      successCallback: (json) => {
        set({object: json, loading: false, error: null});
        onSuccess(json);
      },
      errorCallback: (json) => set({ loading: false, error: json }),
    }
    await client.patch(params);
  },
  clear: () => set({object: null, loading: false, error: null}),
}));

export default useRoomStore;
