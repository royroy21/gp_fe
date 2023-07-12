import { create } from 'zustand'
import client from "../APIClient";
import mergeListsOfObjects from "../helpers/mergeLists";

const onSuccess = (set, json, previousRooms) => {
  if (previousRooms.length > 0) {
    json.results = mergeListsOfObjects(previousRooms, json.results);
  }
  set({ object: json, loading: false, error: null });
}

const useRoomsStore = create((set) => ({
  object: null,
  loading: false,
  error: null,
  get: async (url, previousRooms) => {
    // Merging results for never ending scroll lists.
    set({ loading: true });
    const params = {
      resource: url,
      successCallback: (json) => onSuccess(set, json, previousRooms),
      errorCallback: (json) => set({ loading: false, error: json }),
    }
    await client.get(params);
  },
  clear: () => set({object: null, loading: false, error: null}),
}));

export default useRoomsStore;
