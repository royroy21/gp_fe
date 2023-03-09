import {Dimensions, Modal, ScrollView, StyleSheet, Text, View} from "react-native";
import {Button} from "@react-native-material/core";
import {useState} from "react";
import AddGigModal from "./AddGigModal";

function AddGigButton() {
  const [showAddGig, setShowAddGig] = useState(false);
  return (
    <View style={styles.container}>
      <Button
        title={"+"}
        onPress={() => setShowAddGig(true)}
        style={styles.addGigButton}
      />
      {showAddGig ? <AddGigModal showAddGig={showAddGig} setShowAddGig={setShowAddGig}/> : null}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  addGigButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
  }
});

export default AddGigButton;
