import TopNavigation from "./Top";
import DefaultScreen from "../home/DefaultScreen";
import GigDetail from "../gig/GigDetail";
import EditGig from "../gig/EditGig";
import AddGig from "../gig/AddGig";
import Settings from "../settings";
import OtherUser from "../otherUser";
import ProfilePage from "../profile/ProfilePage";
import EditProfile from "../profile/EditProfile";
import Room from "../message/Room";
import Rooms from "../message/Rooms";
import ShowUsers from "../users/ShowUsers";
import LoginForm from "../loginSignUp/Login";
import SignupForm from "../loginSignUp/SignUp";
import ShowMyGigs from "../gig/ShowMyGigs";
import AddMusic from "../audio/AddMusic";
import AddAlbum from "../audio/AddAlbum";
import AlbumDetail from "../audio/AlbumDetail";
import EditAlbum from "../audio/EditAlbum";
import AddTrack from "../audio/AddTrack";
import EditTrack from "../audio/EditTrack";

const initialRouteName = "DefaultScreen";
export const screens = [
  {
    key: initialRouteName,
    name: initialRouteName,
    title: "gigs",
    linking: {
      path: "gigs/",
    },
    component: DefaultScreen,
  },
  {
    key: "MyGigs",
    name: "MyGigs",
    title: "my_gigs",
    linking: {
      path: "my-gigs/",
    },
    component: ShowMyGigs,
  },
  {
    key: "GigDetail",
    name: "GigDetail",
    title: "gig",
    linking: {
      path: "gig/:id",
    },
    component: GigDetail,
  },
  {
    key: "AddGig",
    name: "AddGig",
    title: "add_gig",
    linking: {
      path: "add-gig/",
    },
    component: AddGig,
  },
  {
    key: "EditGig",
    name: "EditGig",
    title: "edit_gig",
    linking: {
      path: "edit-gig/:id",
    },
    component: EditGig,
  },
  {
    key: "AddMusic",
    name: "AddMusic",
    title: "add_music",
    linking: {
      path: "add-music/:resourceId/:type",
    },
    component: AddMusic,
  },
  {
    key: "AddAlbum",
    name: "AddAlbum",
    title: "add_album",
    linking: {
      path: "add-album/:resourceId/:type",
    },
    component: AddAlbum,
  },
  {
    key: "EditAlbum",
    name: "EditAlbum",
    title: "edit_album",
    linking: {
      path: "edit-album/:id",
    },
    component: EditAlbum,
  },
  {
    key: "AlbumDetail",
    name: "AlbumDetail",
    title: "album",
    linking: {
      path: "album/:id",
    },
    component: AlbumDetail,
  },
  {
    key: "AddTrack",
    name: "AddTrack",
    title: "add_track",
    linking: {
      path: "add-track/:albumId",
    },
    component: AddTrack,
  },
  {
    key: "EditTrack",
    name: "EditTrack",
    title: "edit_track",
    linking: {
      path: "edit-track/:id",
    },
    component: EditTrack,
  },
  {
    key: "UsersScreen",
    name: "UsersScreen",
    title: "users",
    linking: {
      path: "users/",
    },
    component: ShowUsers,
  },
  {
    key: "OtherUser",
    name: "OtherUser",
    title: "user",
    linking: {
      path: "user/:id",
    },
    component: OtherUser,
  },
  {
    key: "Room",
    name: "Room",
    title: "msg",
    linking: {
      path: "message/:id",
    },
    component: Room,
  },
  {
    key: "RoomsScreen",
    name: "RoomsScreen",
    title: "msgs",
    linking: {
      path: "messages/",
    },
    component: Rooms,
  },
  {
    key: "ProfilePage",
    name: "ProfilePage",
    title: "profile",
    linking: {
      path: "profile/",
    },
    component: ProfilePage,
  },
  {
    key: "EditProfile",
    name: "EditProfile",
    title: "edit_profile",
    linking: {
      path: "edit-profile/",
    },
    component: EditProfile,
  },
  {
    key: "Settings",
    name: "Settings",
    title: "stg",
    linking: {
      path: "settings/",
    },
    component: Settings,
  },
  {
    key: "LoginScreen",
    name: "LoginScreen",
    title: "login",
    linking: {
      path: "login/",
    },
    component: LoginForm,
  },
  {
    key: "SignUpScreen",
    name: "SignUpScreen",
    title: "sign_up",
    linking: {
      path: "sign-up/",
    },
    component: SignupForm,
  },
]

function Routes({user, setCurrentRoute, BottomNavigationProps, theme, isWeb, isSmallScreen}) {
  return (
    <TopNavigation
      user={user}
      screens={screens}
      initialRouteName={initialRouteName}
      setCurrentRoute={setCurrentRoute}
      BottomNavigationProps={BottomNavigationProps}
      theme={theme}
      isWeb={isWeb}
      isSmallScreen={isSmallScreen}
    />
  )
}

export default Routes;
