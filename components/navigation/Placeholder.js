import TopNavigation from "./Top";
import {Text, View} from "react-native";

function Content() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>{"meow!! meow!! meow!! meow!!"}</Text>
    </View>
  )
}

function PlaceHolder() {
  const initialRouteName = "PlaceHolder";
  const screenOptions = [
    {
      key: initialRouteName,
      name: initialRouteName,
      component: Content,
    },
  ]
  return (
    <TopNavigation
      screenOptions={screenOptions}
      initialRouteName={initialRouteName}
    />
  )
}

export default PlaceHolder;
