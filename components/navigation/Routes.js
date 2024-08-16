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
import Clear from "../loginSignUp/Clear";
import ResetPasswordRequest from "../loginSignUp/ResetPasswordRequest";
import ResetPassword from "../loginSignUp/ResetPassword";

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
    title: "add",
    linking: {
      path: "add-gig/",
    },
    component: AddGig,
  },
  {
    key: "EditGig",
    name: "EditGig",
    title: "edit",
    linking: {
      path: "edit-gig/:id",
    },
    component: EditGig,
  },
  {
    key: "AddMusic",
    name: "AddMusic",
    title: "add",
    linking: {
      path: "add-music/:resourceId/:type",
    },
    component: AddMusic,
  },
  {
    key: "AddAlbum",
    name: "AddAlbum",
    title: "add",
    linking: {
      path: "add-album/:resourceId/:type",
    },
    component: AddAlbum,
  },
  {
    key: "EditAlbum",
    name: "EditAlbum",
    title: "edit",
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
    title: "add",
    linking: {
      path: "add-track/:albumId",
    },
    component: AddTrack,
  },
  {
    key: "EditTrack",
    name: "EditTrack",
    title: "edit",
    linking: {
      path: "edit-track/:id",
    },
    component: EditTrack,
  },
  {
    key: "UsersScreen",
    name: "UsersScreen",
    title: "profiles",
    linking: {
      path: "profiles/",
    },
    component: ShowUsers,
  },
  {
    key: "OtherUser",
    name: "OtherUser",
    title: "profile",
    linking: {
      path: "profile/:id",
    },
    component: OtherUser,
  },
  {
    key: "Room",
    name: "Room",
    title: "message",
    linking: {
      path: "message/:id",
    },
    component: Room,
  },
  {
    key: "RoomsScreen",
    name: "RoomsScreen",
    title: "messages",
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
    title: "edit",
    linking: {
      path: "edit-profile/",
    },
    component: EditProfile,
  },
  {
    key: "Settings",
    name: "Settings",
    title: "settings",
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
  {
    key: "ResetPasswordRequest",
    name: "ResetPasswordRequest",
    title: "passwd",
    linking: {
      path: "reset-password-request/",
    },
    component: ResetPasswordRequest,
  },
  {
    key: "ResetPassword",
    name: "ResetPassword",
    title: "passwd",
    linking: {
      path: "reset-password/:token",
    },
    component: ResetPassword,
  },
  {
    key: "clear",
    name: "clear",
    title: "clear",
    linking: {
      path: "clear/",
    },
    component: Clear,
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
