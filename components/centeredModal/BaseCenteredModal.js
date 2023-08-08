import React from 'react';
import {Modal, StyleSheet, View, Dimensions, Platform} from "react-native";
import {useTheme} from "@react-native-material/core";

const BaseCenteredModal = ({showModal, setModal, children, buttons}) => {
  const theme = useTheme();
  const windowWidth = Dimensions.get('window').width;
  const isWeb = Boolean(Platform.OS === "web");
  const backgroundColor = theme.palette.background.main;

  const contentStyle = !(isWeb && windowWidth > 1000) ? (
    styles.modalContent
  ) : (
    {
      ...styles.modalContent,
      width: "50%",
      marginLeft: "auto",
      marginRight: "auto",
    }
  )

  return (
    <Modal visible={showModal} animationType={"slide"} transparent={true}>
      <View
        style={{...styles.modalContainer, backgroundColor: backgroundColor}}
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
