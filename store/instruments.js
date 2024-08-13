import { create } from 'zustand'
import client from "../APIClient";
import {BACKEND_ENDPOINTS} from "../settings";

const useInstrumentsStore = create((set) => ({
  object: null,
  loading: false,
  error: null,
  search: async (query) => {
    set({ loading: true });
    const params = {
      resource: BACKEND_ENDPOINTS.searchInstruments + query,
      successCallback: (json) => set({ object: json, loading: false, error: null }),
      errorCallback: (json) => set({ loading: false, error: json }),
    }
    await client.get(params);
  },
  clear: () => set({object: null, loading: false, error: null}),
}));

export default useInstrumentsStore;
