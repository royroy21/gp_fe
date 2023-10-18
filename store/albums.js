import { create } from 'zustand'
import client from "../APIClient";
import {BACKEND_ENDPOINTS} from "../settings";

const useAlbumsStore = create((set) => ({
  object: null,
  loading: false,
  error: null,
  get: async (extraParams) => {
    set({ loading: true });
    const params = {
      resource: BACKEND_ENDPOINTS.album + extraParams,
      successCallback: (json) => set({object: json, loading: false, error: null}),
      errorCallback: (json) => set({ loading: false, error: json }),
    }
    await client.get(params);
  },
  clear: () => set({object: null, loading: false, error: null}),
}));

export default useAlbumsStore;
