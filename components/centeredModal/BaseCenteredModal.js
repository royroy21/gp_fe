import React from 'react';
import {Modal, StyleSheet, View, Dimensions, Platform} from "react-native";
import {useTheme} from "@react-native-material/core";
import {smallScreenWidth} from "../../settings";

const BaseCenteredModal = ({showModal, setModal, children, buttons, forceWidth50Percent=true}) => {
  const theme = useTheme();
  const windowWidth = Dimensions.get('window').width;
  const isWeb = Boolean(Platform.OS === "web");
  const isSmallScreen = windowWidth < smallScreenWidth;
  const backgroundColor = theme.palette.background.main;

  const contentStyle = !(isWeb && windowWidth > 1000) ? (
    styles.modalContent
  ) : (
    {
      ...styles.modalContent,
      width: forceWidth50Percent ? "35%" : undefined,
      marginLeft: "auto",
      marginRight: "auto",
    }
  )

 const containerStyle = isWeb && !isSmallScreen ? {
    borderWidth: 2,
    borderColor: "grey",
    marginTop: 20,
    marginBottom: 20,
    marginLeft: 350,
    marginRight: 350,
   backgroundColor: "black",
 } : {backgroundColor: backgroundColor}

  return (
    <Modal visible={showModal} animationType={"slide"} transparent={true}>
      <View
        style={{...containerStyle, ...styles.modalContainer, }}
        onPress={() => setModal(!showModal)}
      >
        <View style={{...contentStyle, backgroundColor: backgroundColor}}>
          {children}
          {buttons}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
  },
  modalContent: {
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 5,
    padding: 10,
    marginLeft: 20,
    marginRight: 20,
  },
});

export default BaseCenteredModal;
