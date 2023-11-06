import {Dimensions, Platform, StyleSheet} from "react-native";
import CalendarPicker from "react-native-calendar-picker";
import {useTheme} from "@react-native-material/core";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import CenteredModalWithOneButton from "../centeredModal/CenteredModalWithOneButton";
import {View} from "react-native";

function CalendarModal({visible, date, setDate, onRequestClose}) {
  const theme = useTheme();
  const now = new Date();
  const isWeb = Boolean(Platform.OS === "web");
  const windowWidth = Dimensions.get("window").width;
  const containerHeight = isWeb ? Dimensions.get("window").height - 200 : 300;
  return (
    <CenteredModalWithOneButton showModal={visible} setModal={onRequestClose} forceWidth50Percent={false}>
      <View style={{ height: containerHeight }}>
        <CalendarPicker
          initialDate={now}
          selectedDate={date ? new Date(date) : undefined}
          minDate={now}
          width={Math.round(windowWidth*0.9)}  // 90% of screen
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
  calendar: {
    borderWidth: 1,
    borderColor: "pink",
    borderStyle: "solid",
  }
})
