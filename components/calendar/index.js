import {Dimensions, Modal, StyleSheet, View} from "react-native";
import CalendarPicker from "react-native-calendar-picker";
import {Button, darkTheme, useTheme} from "@react-native-material/core";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";

function CalendarModal({visible, date, setDate, onRequestClose}) {
  const theme = useTheme()
  const now = new Date()
  const windowHeight = Dimensions.get("window").height;
  const windowWidth = Dimensions.get("window").width;
  return (
    <Modal
      animationType={"slide"}
      transparent={true}
      visible={visible}
      onRequestClose={onRequestClose}
    >
      <View
        style={{
          backgroundColor: theme.palette.background.main,
          borderWidth: 1,
          borderColor: "gray",
          borderStyle: "solid",
          marginTop: Math.round(windowHeight * 0.2),
          ...styles.container,
        }}
      >
        <View style={{height: Math.round(windowHeight*0.4), marginBottom: 20}}>
          <CalendarPicker
            initialDate={now}
            selectedDate={date ? new Date(date) : undefined}
            minDate={now}
            width={Math.round(windowWidth*0.9)}  // 90% of screen
            textStyle={{
              color: theme.palette.secondary.main,
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
        <View style={styles.closeButtonContainer}>
          <Button
            style={styles.closeButton}
            title={"Close"}
            onPress={() => onRequestClose(false)}
          />
        </View>
      </View>
    </Modal>
  )
}

export default CalendarModal;

const styles = StyleSheet.create({
  container: {
    alignSelf: "center",
    justifyContent: "center",
    marginRight: 50,
    marginLeft: 50,
    borderRadius: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    elevation: 5
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
