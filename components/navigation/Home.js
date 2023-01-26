import TopNavigation from "./Top";
import DefaultScreen from "../home/DefaultScreen";

function Home() {
  const initialRouteName = "DefaultScreen";
  const screenOptions = [
    {
      key: initialRouteName,
      name: initialRouteName,
      component: DefaultScreen,
    },
  ]
  return (
    <TopNavigation
      screenOptions={screenOptions}
      initialRouteName={initialRouteName}
    />
  )
}

export default Home;
