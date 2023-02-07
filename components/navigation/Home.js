import TopNavigation from "./Top";
import DefaultScreen from "../home/DefaultScreen";
import {Text, View} from "react-native";

function PlaceHolderMusic() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>{"meow!! meow!! Music!"}</Text>
    </View>
  )
}

function PlaceHolderMessage() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>{"meow!! meow!! Message"}</Text>
    </View>
  )
}

function Home({setCurrentRoute}) {
  const initialRouteName = "DefaultScreen";
  const screenOptions = [
    {
      key: initialRouteName,
      name: initialRouteName,
      component: DefaultScreen,
    },
    {
      key: "MusicScreen",
      name: "MusicScreen",
      component: PlaceHolderMusic,
    },
    {
      key: "MessageScreen",
      name: "MessageScreen",
      component: PlaceHolderMessage,
    },
  ]
  return (
    <TopNavigation
      screenOptions={screenOptions}
      initialRouteName={initialRouteName}
      setCurrentRoute={setCurrentRoute}
    />
  )
}

export default Home;
