import {Dimensions, Platform, StyleSheet} from "react-native";
import CalendarPicker from "react-native-calendar-picker";
import {useTheme} from "@react-native-material/core";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import CenteredModalWithOneButton from "../centeredModal/CenteredModalWithOneButton";
import {View} from "react-native";
import {smallScreenWidth} from "../../settings";

function CalendarModal({visible, date, setDate, onRequestClose}) {
  const theme = useTheme();
  const now = new Date();
  const isWeb = Boolean(Platform.OS === "web");
  const windowWidth = Dimensions.get("window").width;
  const isSmallScreen = windowWidth < smallScreenWidth;
  const containerStyle = isWeb && !isSmallScreen ?  {height: 600} : {height: 300};
  const extraCalendarPickerAttributes = isWeb && !isSmallScreen ? {width: 1000, scaleFactor: 500} : {};
  return (
    <CenteredModalWithOneButton
      showModal={visible}
      setModal={onRequestClose}
      forceWidth50Percent={isSmallScreen}
    >
      <View style={containerStyle}>
        <CalendarPicker
          initialDate={now}
          selectedDate={date ? new Date(date) : undefined}
          minDate={now}
          textStyle={{
            color: theme.palette.primary.main,
          }}
          todayBackgroundColor={theme.palette.primary.main}
          todayTextStyle={{color: theme.palette.background.main}}
          selectedDayStyle={{
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.background.main,
          }}
          restrictMonthNavigation={true}
          headerWrapperStyle={{marginTop: 10}}
          style={styles.calendar}
          nextComponent={
            <Icon
              name="chevron-right"
              size={25}
              color={theme.palette.secondary.main}
            />
          }
          previousComponent={
            <Icon
              name="chevron-left"
              size={25}
              color={theme.palette.secondary.main}
            />
          }
          onDateChange={(date) => {
            setDate(date)
            onRequestClose()
          }}
          {...extraCalendarPickerAttributes}
        />
      </View>
    </CenteredModalWithOneButton>
  )
}

export default CalendarModal;

const styles = StyleSheet.create({
  closeButtonContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  closeButton: {
    width: "40%",
    marginBottom: 10,
  },
})
