import {StyleSheet, View} from 'react-native';
import { Button } from "@react-native-material/core";
import {useCallback, useRef, useState} from "react";
import Image from "./Image";
import {useFocusEffect} from "@react-navigation/native";

function ImagePickerWeb(props) {
  const {
    setImage: setImageToForm,
    removeImage: removeImageFromForm,
    existingImage=null,
    thumbnailUrl=null,
  } = props;
  const inputFile = useRef(null);
  const [image, setImage] = useState(null);
  const [newUpload, setNewUpload] = useState(false);

  useFocusEffect(
    useCallback(() => {
      if (existingImage && !image) {
        setImage({
          isExistingImage: true,
          uri: existingImage,
        })
      }
      return () => {
        setImage(null);
        setNewUpload(false);
      };
    }, [])
  );

  const pickImage = (e) => {
    const data = e.target.files[0]
    setImage(data);
    setImageToForm(data);
    setNewUpload(true);
  }

  const removeImage = () => {
    setImage(null);
    removeImageFromForm();
    setNewUpload(false);
  }

  return (
    <View style={styles.container}>
      {image && (
        <View style={styles.imageContainer}>
          <Image
            imageUri={newUpload ? URL.createObjectURL(image) : image.uri}
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
        <>
          <View style={{display: "none"}}>
             <input
               ref={inputFile}
               type={"file"}
               onChange={pickImage}
               accept="image/*"
             />
          </View>
          <Button
            title={"pick image"}
            onPress={() => inputFile.current.click()}
            style={styles.button}
          />
        </>
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

export default ImagePickerWeb;
