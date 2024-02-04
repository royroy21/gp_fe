import React from "react";
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import LoginOrMenuButton from "./LoginOrMenuButton";
import {useTheme} from "@react-native-material/core";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import {screens} from "./Routes";
import GoBackButton from "./GoBackButton";
import Title from "./Title";
import useUserStore from "../../store/user";

const DefaultStack = createNativeStackNavigator();
function DefaultStackScreen({ initialRouteName }) {
  const user = useUserStore((state) => state.object);
  return (
    <DefaultStack.Navigator
      initialRouteName={initialRouteName}
      screenOptions={{animation: "none"}}
    >
      {screens.map(options => (
        <DefaultStack.Screen
          key={options.key}
          name={options.name}
          component={options.component}
          options={({ navigation, route }) =>
            ({
              headerLeft: ()=> (
                <GoBackButton
                  navigation={navigation}
                  route={route}
                />
              ),
              headerBackVisible: false,
              headerTitle: () => (
                <Title
                  navigation={navigation}
                  title={options.title}
                  isSmallScreen={true}
                />
              ),
              headerRight: () => {
                return (
                  <LoginOrMenuButton
                    user={user}
                    isWeb={false}
                    isSmallScreen={true}
                    navigation={navigation}
                    route={route}
                  />
                )
              },
            })
          }
        />
      ))}
    </DefaultStack.Navigator>
  );
}

const HomeStackScreen = () => {
  return (
    <DefaultStackScreen initialRouteName={"DefaultScreen"} />
  )
}

const UsersStackScreen = () => {
  return (
    <DefaultStackScreen initialRouteName={"UsersScreen"}/>
  )
}

const RoomsStackScreen = () => {
  return (
    <DefaultStackScreen initialRouteName={"RoomsScreen"} />
  )
}

function MobileNavigation() {
  const Tab = createBottomTabNavigator();
  const theme = useTheme();
  return (
    <Tab.Navigator screenOptions={({ route }) => ({
      headerShown: false,
      tabBarLabel: () => null,
      tabBarIcon: ({ focused, color, size }) => {
        const iconMap = {
          HomeTab: "pig",
          UsersTab: "account-multiple",
          RoomsTab: "message",  // TODO - still need to set `message-badge` here if there are unread messages.
        }
        return (
          <Icon
            key={iconMap[route.name]}
            name={iconMap[route.name]}
            size={25}
            style={{
              color: focused ? theme.palette.primary.main : "grey",
            }}
          />
        )
      }
    })}>
      <Tab.Screen
        name="HomeTab"
        component={HomeStackScreen}
        listeners={({navigation, route}) => ({
          tabPress: e => {
            e.preventDefault();
            navigation.navigate("HomeTab", {screen: "DefaultScreen"});
          },
        })}
      />
      <Tab.Screen
        name="UsersTab"
        component={UsersStackScreen}
        listeners={({navigation, route}) => ({
          tabPress: e => {
            e.preventDefault();
            navigation.navigate("UsersTab", {screen: "UsersScreen"});
          },
        })}
      />
      <Tab.Screen
        name="RoomsTab"
        component={RoomsStackScreen}
        listeners={({navigation, route}) => ({
          tabPress: e => {
            e.preventDefault();
            navigation.navigate("RoomsTab", {screen: "RoomsScreen"});
          },
        })}
      />
    </Tab.Navigator>
  )
}

export default MobileNavigation;
