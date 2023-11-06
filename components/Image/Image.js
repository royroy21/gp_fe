import {Dimensions, Image as ReactNativeImage, Modal, Platform, Pressable, StyleSheet, View} from 'react-native';
import {useState} from "react";
import {Button} from "@react-native-material/core";

function Image(props) {
  const {
    imageUri,
    thumbnailUri,
    smallerThumbnail=false,
    onThumbnailPress=null,
    withModalViewOnPress=true,
    containerStyle={},
    thumbnailStyle={},
  } = props;
  const [modalVisible, setModalVisible] = useState(false);
  const windowWidth = Dimensions.get("window").width;
  const windowHeight = Dimensions.get("window").height;
  const dimensions = (windowWidth / 4);
  const isWeb = Boolean(Platform.OS === "web");
  const defaultGigPigImage = require("../../assets/default_gigpig.jpeg");
  const defaultGigPigThumbnail = require("../../assets/default_gigpig_thumbnail.jpeg");
  const largerThumbnailStyle = {
      width: dimensions,
      height: dimensions,
      borderRadius: 15,
      ...styles.image,
  };
  const smallerThumbnailStyle = {
      width: isWeb ? 100 : 50,
      height: isWeb ? 100 : 50,
      // borderRadius: isWeb ? 50 : 25,
      borderRadius: 5,
      ...styles.image,
  };
  const getThumbnailStyle = () => {
    if (Object.keys(thumbnailStyle).length) {
      return {
        ...thumbnailStyle,
        ...styles.image,
      }
    }
    if (smallerThumbnail) {
      return smallerThumbnailStyle
    }
    return isWeb ? smallerThumbnailStyle : largerThumbnailStyle;
  }
  const computedThumbnailStyle = getThumbnailStyle();

  const mobileModalImageStyle = {
    width: windowWidth,
    height: windowWidth,
    resizeMode: "stretch",
  };
  const webModalImageStyle = {
    width: windowHeight - 100,
    height: windowHeight - 100,
    resizeMode: "stretch",
  };
  const modalImageStyle = isWeb ? webModalImageStyle : mobileModalImageStyle;

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
        if (onThumbnailPress) {
          onThumbnailPress();
        } else if (withModalViewOnPress) {
          setModalVisible(true)
        }
      }}>
        <ReactNativeImage
          source={getThumbnailSrc()}
          style={computedThumbnailStyle}
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
            style={modalImageStyle}
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
