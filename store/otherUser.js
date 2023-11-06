import { create } from 'zustand'
import client from "../APIClient";
import {BACKEND_ENDPOINTS} from "../settings";

const useOtherUserStore = create((set) => ({
  object: null,
  loading: false,
  error: null,
  store: user => set({ object: user, loading: false, error: null }),
  get: async (id, onSuccess = () => {}) => {
    set({ loading: true });
    const params = {
      resource: `${BACKEND_ENDPOINTS.user}${id}/`,
      successCallback: (json) => {
        set({object: json, loading: false, error: null})
        onSuccess(json);
      },
      errorCallback: (json) => set({ loading: false, error: json }),
    }
    await client.get(params);
  },
  clear: () => set({object: null, loading: false, error: null}),
}));

export default useOtherUserStore;
