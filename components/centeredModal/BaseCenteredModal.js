import React from 'react';
import {Modal, StyleSheet, View, Pressable} from "react-native";
import {useTheme} from "@react-native-material/core";

const BaseCenteredModal = ({showModal, setModal, children, buttons}) => {
  const theme = useTheme();
  const backgroundColor = theme.palette.background.main;

  return (
    <Modal visible={showModal} animationType={"slide"} transparent={true}>
      <Pressable
        style={{...styles.modalContainer, backgroundColor: backgroundColor}}
        onPress={() => setModal(!showModal)}
      >
        <View style={{...styles.modalContent, backgroundColor: backgroundColor}}>
          {children}
          {buttons}
        </View>
      </Pressable>
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
