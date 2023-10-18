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

function Routes({user, setCurrentRoute, BottomNavigationProps, theme, isWeb, isSmallScreen}) {
  const initialRouteName = "DefaultScreen";
  const screens = [
    {
      key: initialRouteName,
      name: initialRouteName,
      title: "gigs",
      component: DefaultScreen,
    },
    {
      key: "MyGigs",
      name: "MyGigs",
      title: "my_gigs",
      component: ShowMyGigs,
    },
    {
      key: "GigDetail",
      name: "GigDetail",
      title: "gig",
      component: GigDetail,
    },
    {
      key: "AddGig",
      name: "AddGig",
      title: "add_gig",
      component: AddGig,
    },
    {
      key: "AddMusic",
      name: "AddMusic",
      title: "add_music",
      component: AddMusic,
    },
    {
      key: "AddAlbum",
      name: "AddAlbum",
      title: "add_album",
      component: AddAlbum,
    },
    {
      key: "EditAlbum",
      name: "EditAlbum",
      title: "edit_album",
      component: EditAlbum,
    },
    {
      key: "AlbumDetail",
      name: "AlbumDetail",
      title: "album",
      component: AlbumDetail,
    },
    {
      key: "AddTrack",
      name: "AddTrack",
      title: "add_track",
      component: AddTrack,
    },
    {
      key: "EditTrack",
      name: "EditTrack",
      title: "edit_track",
      component: EditTrack,
    },
    {
      key: "EditGig",
      name: "EditGig",
      title: "edit_gig",
      component: EditGig,
    },
    {
      key: "UsersScreen",
      name: "UsersScreen",
      title: "users",
      component: ShowUsers,
    },
    {
      key: "Room",
      name: "Room",
      title: "msg",
      component: Room,
    },
    {
      key: "RoomsScreen",
      name: "RoomsScreen",
      title: "msgs",
      component: Rooms,
    },
    {
      key: "OtherUser",
      name: "OtherUser",
      title: "user",
      component: OtherUser,
    },
    {
      key: "ProfilePage",
      name: "ProfilePage",
      title: "profile",
      component: ProfilePage,
    },
    {
      key: "EditProfile",
      name: "EditProfile",
      title: "edit_profile",
      component: EditProfile,
    },
    {
      key: "Settings",
      name: "Settings",
      title: "stg",
      component: Settings,
    },
    {
      key: "LoginScreen",
      name: "LoginScreen",
      title: "login",
      component: LoginForm,
    },
    {
      key: "SignUpScreen",
      name: "SignUpScreen",
      title: "sign_up",
      component: SignupForm,
    },
  ]
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
