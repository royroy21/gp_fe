import { create } from 'zustand'
import {BACKEND_ENDPOINTS} from "../settings";
import AsyncStorage, {useAsyncStorage} from "@react-native-async-storage/async-storage";

const setJWT = async (set, json, onSuccess) => {
  const { setItem: setJWTToAsyncStorage } = useAsyncStorage("jwt");
  await AsyncStorage.removeItem("jwt");
  const jwtAsString = JSON.stringify(json);
  await setJWTToAsyncStorage(jwtAsString);
  set({ object: jwtAsString, loading: false, error: null });
  onSuccess()
}

const getJWT = async (set, url, data, onSuccess, post) => {
  set({ loading: true });
  const params = {
    resource: url,
    data: data,
    successCallback: (json) => setJWT(set, json, onSuccess),
    errorCallback: (json) => set({ object: null, loading: false, error: json }),
  }
  await post(params);
}

const useJWTStore = create((set) => ({
  object: null,
  loading: false,
  error: null,
  login: async (data, onSuccess, post) => {
    await getJWT(set, BACKEND_ENDPOINTS.token, data, onSuccess, post);
  },
  create: async (data, onSuccess, post) => {
    await getJWT(set, BACKEND_ENDPOINTS.user, data, onSuccess, post);
  },
  setExisting: (jwt) => set({object: jwt, loading: false, error: null}),
  clear: () => set({object: null, loading: false, error: null}),
}));

export default useJWTStore;
