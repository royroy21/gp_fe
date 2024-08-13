import useAlbumStore from "./album";
import useAlbumsStore from "./albums";
import useCountriesStore from "./countries";
import useCountryStore from "./country";
import useGenresStore from "./genres";
import useGigStore from "./gig";
import useGigsStore from "./gigs";
import useInstrumentsStore from "./instruments";
import useMyGigsStore from "./myGigs";
import useJWTStore from "./jwt";
import useOtherUserStore from "./otherUser";
import usePreviousMessagesStore from "./previousMessages";
import useRoomsStore from "./rooms";
import useTrackStore from "./track";
import unreadMessagesStore from "./unreadMessages";
import useUserStore from "./user";
import useUsersStore from "./users";

function ClearAll(doNotClearThese=[]) {
  const stores = {
    album: useAlbumStore,
    albums: useAlbumsStore,
    countries: useCountriesStore,
    country: useCountryStore,
    genres: useGenresStore,
    gig: useGigStore,
    gigs: useGigsStore,
    instruments: useInstrumentsStore,
    myGigs: useMyGigsStore,
    jwt: useJWTStore,
    otherUser: useOtherUserStore,
    previousMessages: usePreviousMessagesStore,
    rooms: useRoomsStore,
    track: useTrackStore,
    unreadMessages: unreadMessagesStore,
    user: useUserStore,
    users: useUsersStore,
  }
  Object.keys(stores).forEach((key) => {
    if (!doNotClearThese.includes(key)) {
      const value = stores[key];
      value.getState().clear();
    }
  });
}

export default ClearAll;
