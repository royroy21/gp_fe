import {Dimensions, StyleSheet} from "react-native";
import CalendarPicker from "react-native-calendar-picker";
import {useTheme} from "@react-native-material/core";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import CenteredModalWithOneButton from "../centeredModal/CenteredModalWithOneButton";
import {View} from "react-native";

function CalendarModal({visible, date, setDate, onRequestClose}) {
  const theme = useTheme()
  const now = new Date()
  const windowWidth = Dimensions.get("window").width;
  return (
    <CenteredModalWithOneButton showModal={visible} setModal={onRequestClose}>
      <View style={styles.container}>
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
  container: {
    height: 300,
  },
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
