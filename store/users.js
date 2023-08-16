import { create } from 'zustand'
import client from "../APIClient";
import mergeListsOfObjects from "../helpers/mergeLists";

const onSuccess = (set, json, previousUsers, doNotMergeResults) => {
  if (!doNotMergeResults && previousUsers.length > 0) {
    json.results = mergeListsOfObjects(previousUsers, json.results);
  }
  set({ object: json, loading: false, error: null });
}

const useUsersStore = create((set) => ({
  object: null,
  loading: false,
  error: null,
  get: async (url, previousUsers, doNotMergeResults=false) => {
    // Merging results for never ending scroll lists.
    // URL could be for user API, search API or next page.
    set({ loading: true });
    const params = {
      resource: url,
      successCallback: (json) => onSuccess(set, json, previousUsers, doNotMergeResults),
      errorCallback: (json) => set({ loading: false, error: json }),
    }
    await client.get(params);
  },
  clear: () => set({object: null, loading: false, error: null}),
}));

export default useUsersStore;
