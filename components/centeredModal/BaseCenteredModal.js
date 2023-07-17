import React from 'react';
import {Modal, StyleSheet, View} from "react-native";
import {useTheme} from "@react-native-material/core";

const BaseCenteredModal = ({showModal, children, buttons}) => {
  const theme = useTheme()
  return (
    <Modal visible={showModal} animationType={"slide"} transparent={true}>
      <View style={styles.modalContainer}>
        <View style={{...styles.modalContent, backgroundColor: theme.palette.background.main}}>
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
