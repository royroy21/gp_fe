import useUserStore from "../../store/user";
import {ListItem, Text, useTheme} from "@react-native-material/core";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import DisplayGenres from "../gig/DisplayGenres";
import CustomScrollViewWithTwoButtons from "../views/CustomScrollViewWithTwoButtons";

function ProfilePage({ navigation }) {
  const theme = useTheme();
  const { object } = useUserStore();

  const edit = () => {
    navigation.navigate("EditProfile");
  }
  return (
    <CustomScrollViewWithTwoButtons
      actionButtonTitle={"edit"}
      actionButtonOnPress={edit}
      backButtonTitle={"go back"}
      backButtonOnPress={navigation.goBack}
    >
      <ListItem
        title={<Text>{object.username}</Text>}
        trailing={
          <Icon
            name="account"
            size={25}
            color={theme.palette.secondary.main}
          />
        }
      />
      <ListItem
        title={<Text>{object.email}</Text>}
        trailing={
          <Icon
            name="email"
            size={25}
            color={theme.palette.secondary.main}
          />
        }
      />
      <ListItem
        title={<Text>{object.bio}</Text>}
        trailing={
          <Icon
            name="music"
            size={25}
            color={theme.palette.secondary.main}
          />
        }
      />
      <DisplayGenres genres={object.genres}/>
    </CustomScrollViewWithTwoButtons>
  )
}

export default ProfilePage;
