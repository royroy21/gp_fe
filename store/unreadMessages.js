import { create } from 'zustand'

const unreadMessagesStore = create((set) => ({
  unreadMessages: [],
  addList: (roomIds) => set((state) => {
    return { unreadMessages: [...state.unreadMessages, ...roomIds] };
  }),
  add: (roomId) => set((state) => {
    state.unreadMessages.push(roomId);
    return { unreadMessages: state.unreadMessages };
  }),
  remove: (roomId) => set((state) => {
    const upDatedUnreadMessages = state.unreadMessages.filter(item => roomId !== item);
    return { unreadMessages: upDatedUnreadMessages };
  }),
  clear: () => set({unreadMessages: []}),
}));

export default unreadMessagesStore;
