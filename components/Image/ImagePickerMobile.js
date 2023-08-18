import {StyleSheet, View} from 'react-native';
import { Button } from "@react-native-material/core";
import * as ImagePickerLibrary from 'expo-image-picker';
import { useCallback, useState } from "react";
import Image from "./Image";
import {useFocusEffect} from "@react-navigation/native";

function ImagePickerMobile(props) {
  const {
    setImage: setImageToForm,
    removeImage: removeImageFromForm,
    existingImage=null,
    thumbnailUrl=null,
  } = props;
  const [image, setImage] = useState(null);

  useFocusEffect(
    useCallback(() => {
      if (existingImage && !image) {
        setImage({
          isExistingImage: true,
          uri: existingImage,
        })
      }
    }, [])
  );

  const pickImageAsync = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePickerLibrary.launchImageLibraryAsync({
      mediaTypes: ImagePickerLibrary.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      return result.assets[0];
    }
  };

  const pickImage = () => {
    pickImageAsync().then(data => {
      if (!data) {
        return
      }
      setImage(data);
      setImageToForm(data);
    })
  }

  const removeImage = () => {
    setImage(null);
    removeImageFromForm();
  }

  return (
    <View style={styles.container}>
      {image && (
        <View style={styles.imageContainer}>
          <Image
            imageUri={image.uri}
            thumbnailUri={thumbnailUrl}
          />
        </View>
      )}
      <View style={styles.buttonContainer}>
      {image ? (
        <Button
          title={"remove image"}
          onPress={removeImage}
          style={styles.button}
        />
      ) : (
        <Button
          title={"pick image"}
          onPress={pickImage}
          style={styles.button}
        />
      )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    marginBottom: 20,
  },
  imageContainer: {
    marginLeft: 20,
  },
  buttonContainer: {
    marginLeft: 40,
    justifyContent: "center",
  },
  button: {
    alignSelf: "flex-end",
    marginBottom: 5,
  },
})

export default ImagePickerMobile;
