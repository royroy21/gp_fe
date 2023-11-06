import { create } from 'zustand'

const useLastRouteStore = create((set) => ({
  object: null,
  store: (lastRoute) => set({ object: lastRoute }),
  clear: () => set({object: null}),
}));

export default useLastRouteStore;
