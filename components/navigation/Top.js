import {createNativeStackNavigator} from "@react-navigation/native-stack";
import LoginOrMenuButton from "./LoginOrMenuButton";
import {View, StyleSheet, ImageBackground} from "react-native";
import GoBackButton from "./GoBackButton";
import Title from "./Title";

function TopNavigation(props) {
  const {
    user,
    screens,
    initialRouteName,
    BottomNavigationProps,
    theme,
    isWeb,
    isSmallScreen,
  } = props;
  const Stack = createNativeStackNavigator();
  const extraContainerStyle = isWeb && !isSmallScreen ? {
    marginTop: 20,
    marginBottom: 20,
    marginLeft: 150,
    marginRight: 150,
    backgroundColor: "#000000",
  } : {}

  const image = require("../../assets/background.jpg");
  return (
    <View style={styles.outerContainer}>
      <ImageBackground source={image} resizeMode={"cover"} style={{flex: 1}}>
        <View  style={{...extraContainerStyle, ...styles.container}}>
          <Stack.Navigator
            initialRouteName={initialRouteName}
            screenOptions={{animation: "none"}}
          >
            {screens.map(options => (
              <Stack.Screen
                key={options.key}
                name={options.name}
                component={options.component}
                options={({ navigation, route }) =>
                  ({
                    headerLeft: ()=> (
                      <GoBackButton
                        navigation={navigation}
                        route={route}
                        isWeb={isWeb}
                      />
                    ),
                    headerBackVisible: false,
                    headerTitle: () => (
                      <Title
                        title={options.title}
                        navigation={navigation}
                        route={route}
                        initialRouteName={initialRouteName}
                        BottomNavigationProps={BottomNavigationProps}
                        isWeb={isWeb}
                        isSmallScreen={isSmallScreen}
                      />
                    ),
                    headerRight: () => {
                      return (
                        <LoginOrMenuButton
                          user={user}
                          isWeb={isWeb}
                          isSmallScreen={isSmallScreen}
                          navigation={navigation}
                          route={route}
                        />
                      )
                    },
                  })
                }
              />
            ))}
          </Stack.Navigator>
        </View>
      </ImageBackground>
    </View>
  )
}

export default TopNavigation;

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: "#000000",
  },
  container: {
    flex: 1,
    zIndex: 3,
  },
});
