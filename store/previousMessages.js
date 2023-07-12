import { create } from 'zustand'
import client from "../APIClient";
import mergeListsOfObjects from "../helpers/mergeLists";

const onSuccess = (set, json, previousMessages, onSuccessExtra) => {
  json.results = json.results.reverse()
  if (previousMessages.length > 0) {
    json.results = mergeListsOfObjects(json.results, previousMessages);
  }
  set({ object: json, loading: false, error: null });
  if (onSuccessExtra) {
    onSuccessExtra(json.results);
  }
}

const usePreviousMessagesStore = create((set) => ({
  object: null,
  loading: false,
  error: null,
  get: async (url, previousMessages=[], onSuccessExtra=null) => {
    // Merging results for never ending scroll lists.
    set({ loading: true });
    const params = {
      resource: url,
      successCallback: (json) => onSuccess(set, json, previousMessages, onSuccessExtra),
      errorCallback: (json) => set({ loading: false, error: json }),
    }
    await client.get(params);
  },
  clear: () => set({object: null, loading: false, error: null}),
}));

export default usePreviousMessagesStore;
