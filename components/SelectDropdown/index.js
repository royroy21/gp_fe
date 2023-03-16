import ReactNativeSelectDropdown from "react-native-select-dropdown";
import {useTheme} from "@react-native-material/core";
import {StyleSheet} from "react-native";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";

function SelectDropdown (props){
  const theme = useTheme();
  return (
    <ReactNativeSelectDropdown
      renderDropdownIcon={() => {
        return (
          <Icon
            name={"chevron-down"}
            size={25}
            color={theme.palette.secondary.main}
            style={styles.dropdownButtonIcon}
          />
        )
      }}
      buttonStyle={{
        backgroundColor: theme.palette.background.main,
        ...styles.dropdownButton,
      }}
      buttonTextStyle={{
        color: theme.palette.surface.on,
        ...styles.dropdownButtonText,
      }}
      rowTextStyle={{
        color: theme.palette.surface.on,
        ...styles.dropdownRowTextStyle,
      }}
      search={true}
      searchInputTxtColor={theme.palette.surface.on}
      searchInputStyle={{
        backgroundColor: theme.palette.background.main,
      }}
      dropdownStyle={{
        color: theme.palette.secondary.main,
        backgroundColor: theme.palette.background.main,
        borderColor: theme.palette.primary.main,
        ...styles.dropdownStyle,
      }}
      renderSearchInputLeftIcon={() => {
        return (
          <Icon
            name={"magnify"}
            size={25}
            color={theme.palette.secondary.main}
          />
        );
      }}
      {...props}
    />
  )
}

const styles = StyleSheet.create({
  dropdownButtonIcon: {
    marginRight: 10,
  },
  dropdownButton: {
    marginTop: 2,
    marginBottom: 2,
    width: "100%",
    borderBottomColor: "#949494",
  },
  dropdownButtonText: {
    fontSize: 16,
    textAlign: "left",
  },
  dropdownStyle: {
    borderWidth: 1,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
  },
  dropdownRowTextStyle: {
    fontSize: 16,
  }
});

export default SelectDropdown;
