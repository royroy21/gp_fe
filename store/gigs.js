import { create } from 'zustand'
import client from "../APIClient";
import mergeListsOfObjects from "../helpers/mergeLists";

const onSuccess = (set, json, previousGigs, doNotMergeResults) => {
  if (!doNotMergeResults && previousGigs.length > 0) {
    json.results = mergeListsOfObjects(previousGigs, json.results);
  }
  set({ object: json, loading: false, error: null });
}

const useGigsStore = create((set) => ({
  object: null,
  searchFeedback: null,
  lastURL: null,
  loading: false,
  error: null,
  get: async (url, previousGigs, doNotMergeResults=false) => {
    // Merging results for never ending scroll lists.
    // URL could be for gig API, search API or next page.
    set({ loading: true });
    const params = {
      resource: url,
      successCallback: (json) => onSuccess(set, json, previousGigs, doNotMergeResults),
      errorCallback: (json) => set({ loading: false, error: json }),
    }
    await client.get(params);
  },
  setSearchFeedback: searchFeedback => set({searchFeedback}),
  setLastURL: lastURL => set({lastURL}),
  clear: () => set({
    object: null,
    searchFeedback: null,
    lastURL: null,
    loading: false,
    error: null,
  }),
}));

export default useGigsStore;
