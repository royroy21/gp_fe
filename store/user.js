import { create } from 'zustand'
import client from "../APIClient";
import {BACKEND_ENDPOINTS} from "../settings";
import updateLocation from "../components/location/updateLocation";
import {registerForPushNotifications} from "../components/notifications";

// TODO - turning off push notifications for now.
const setUserUpdateLocationRegisterForPushNotifications = async (set, json) => {
  set({ object: json, loading: false, error: null })
  updateLocation(json.id);
  registerForPushNotifications(json.id);
}

const useUserStore = create((set) => ({
  object: null,
  loading: false,
  error: null,
  me: async () => {
    set({ loading: true });
    const params = {
      resource: BACKEND_ENDPOINTS.me,
      successCallback: (json) => set({ object: json, loading: false, error: null }),
      errorCallback: (json) => set({ object: null, loading: false, error: json }),
    }
    await client.get(params);
  },
  patch: async (id, data, onSuccess = () => {}, isMultipartFormData=false) => {
    set({ loading: true });
    const params = {
      resource: `${BACKEND_ENDPOINTS.user}${id}/`,
      data: data,
      successCallback: (json) => {
        set({object: json, loading: false, error: null})
        onSuccess(json);
      },
      errorCallback: (json) => set({ loading: false, error: json }),
    }
    await client.patch(params, isMultipartFormData);
  },
  addFavorite: async (user_id, onSuccess = () => {}) => {
    set({ loading: true });
    const params = {
      resource: `${BACKEND_ENDPOINTS.user}add-favorite-user/`,
      data: {id: user_id},
      successCallback: (json) => {
        set({loading: false, error: null})
        onSuccess(json);
      },
      errorCallback: (json) => set({ loading: false, error: json }),
    }
    await client.post(params);
  },
  removeFavorite: async (user_id, onSuccess = () => {}) => {
    set({ loading: true });
    const params = {
      resource: `${BACKEND_ENDPOINTS.user}remove-favorite-user/`,
      data: {id: user_id},
      successCallback: (json) => {
        set({loading: false, error: null})
        onSuccess(json);
      },
      errorCallback: (json) => set({ loading: false, error: json }),
    }
    await client.post(params);
  },
  clear: () => set({object: null, loading: false, error: null}),
}));

export default useUserStore;
