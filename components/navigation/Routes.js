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

function Routes({user, setCurrentRoute, BottomNavigationProps, theme, isWeb}) {
  const initialRouteName = "DefaultScreen";
  const screens = [
    {
      key: initialRouteName,
      name: initialRouteName,
      title: "GIGPIG/gigs",
      component: DefaultScreen,
    },
    {
      key: "GigDetail",
      name: "GigDetail",
      title: "GIGPIG/gig",
      component: GigDetail,
    },
    {
      key: "AddGig",
      name: "AddGig",
      title: "GIGPIG/add_gig",
      component: AddGig,
    },
    {
      key: "EditGig",
      name: "EditGig",
      title: "GIGPIG/edit_gig",
      component: EditGig,
    },
    {
      key: "UsersScreen",
      name: "UsersScreen",
      title: "GIGPIG/users",
      component: ShowUsers,
    },
    {
      key: "Room",
      name: "Room",
      title: "GIGPIG/msg",
      component: Room,
    },
    {
      key: "RoomsScreen",
      name: "RoomsScreen",
      title: "GIGPIG/msgs",
      component: Rooms,
    },
    {
      key: "OtherUser",
      name: "OtherUser",
      title: "GIGPIG/user",
      component: OtherUser,
    },
    {
      key: "ProfilePage",
      name: "ProfilePage",
      title: "GIGPIG/profile",
      component: ProfilePage,
    },
    {
      key: "EditProfile",
      name: "EditProfile",
      title: "GIGPIG/edit_profile",
      component: EditProfile,
    },
    {
      key: "Settings",
      name: "Settings",
      title: "GIGPIG/settings",
      component: Settings,
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
    />
  )
}

export default Routes;
