import {Dimensions, Image as ReactNativeImage, Modal, Pressable, StyleSheet, View} from 'react-native';
import {useState} from "react";
import {Button} from "@react-native-material/core";
import defaultGigPigThumbnail from "../../assets/default_gigpig_thumbnail.jpeg";

function Image(props) {
  const {
    imageUri,
    thumbnailUri,
    withModalViewOnPress=true,
    containerStyle={},
  } = props;
  const [modalVisible, setModalVisible] = useState(false);
  const windowWidth = Dimensions.get("window").width;
  const dimensions = (windowWidth / 4);
  const defaultGigPigImage = require("../../assets/default_gigpig.jpeg");
  const defaultGigPigThumbnail = require("../../assets/default_gigpig_thumbnail.jpeg");

  const getImageSrc = () => {
    if (imageUri) {
      return {uri: imageUri}
    }
    return defaultGigPigImage
  }
  const getThumbnailSrc = () => {
    if (thumbnailUri) {
      return {uri: thumbnailUri}
    }
    if (imageUri) {
      return {uri: imageUri}
    }
    return defaultGigPigThumbnail
  }

  return (
    <View style={{...containerStyle}}>
      <Pressable onPress={() => {
        if (imageUri && withModalViewOnPress) {
          setModalVisible(true)
        }
      }}>
        <ReactNativeImage
          source={getThumbnailSrc()}
          style={{
            width: dimensions,
            height: dimensions,
            borderRadius: dimensions / 2,
            ...styles.image,
          }}
        />
      </Pressable>
      <Modal
        visible={modalVisible}
        animationType={"slide"}
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={{...styles.modalContent, height: windowWidth + 50}}>
          <ReactNativeImage
            source={getImageSrc()}
            style={{width: windowWidth, height: windowWidth, resizeMode: "stretch"}}
          />
          <Button
            title={"close"}
            onPress={() => setModalVisible(false)}
            style={styles.closeButton}
          />
        </View>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  image: {
    backgroundColor: "grey",
  },
  modalContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "black",
  },
  closeButton: {
    margin: 10,
  },
})

export default Image;
