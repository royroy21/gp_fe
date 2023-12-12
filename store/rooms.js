import { create } from 'zustand'
import client from "../APIClient";
import mergeListsOfObjects from "../helpers/mergeLists";

const onSuccess = (set, json, previousRooms, doNotMergeResults) => {
  if (!doNotMergeResults && previousRooms.length > 0) {
    json.results = mergeListsOfObjects(previousRooms, json.results);
  }
  set({ object: json, loading: false, error: null });
}

const useRoomsStore = create((set) => ({
  object: null,
  searchFeedback: null,
  loading: false,
  error: null,
  get: async (url, previousRooms, doNotMergeResults=false) => {
    // Merging results for never ending scroll lists.
    // URL could be for room API, search API or next page.
    set({ loading: true });
    const params = {
      resource: url,
      successCallback: (json) => onSuccess(set, json, previousRooms, doNotMergeResults),
      errorCallback: (json) => set({ loading: false, error: json }),
    }
    await client.get(params);
  },
  setSearchFeedback: searchFeedback => set({searchFeedback}),
  clear: () => set({
    object: null,
    searchFeedback: null,
    loading: false,
    error: null,
  }),
}));

export default useRoomsStore;
