import useUserStore from "../../store/user";
import LoadingModal from "../loading/LoadingModal";
import Errors from "../forms/Errors";
import {Controller, useForm} from "react-hook-form";
import TextInput from "../forms/TextInput";
import React, {useEffect, useState} from "react";
import DisplayGenres from "../gig/DisplayGenres";
import ImagePickerMobile from "../Image/ImagePickerMobile";
import {formatImageForForm, getDataWithOutImage} from "../Image/helpers";
import CustomScrollViewWithOneButton from "../views/CustomScrollViewWithOneButton";
import {Platform} from "react-native";
import ImagePickerWeb from "../Image/ImagePickerWeb";
import SelectGenres from "../selectors/SelectGenres";
import {useTheme} from "@react-native-material/core";
import {useIsFocused} from "@react-navigation/native";
import PleaseLoginMessage from "../loginSignUp/PleaseLoginMessage";

function EditProfile({ navigation }) {
  const isFocused = useIsFocused();
  const theme = useTheme();
  const { object: user, patch, loading, error } = useUserStore();

  if (!user && !loading) {
    return (
      <PleaseLoginMessage theme={theme} />
    )
  }

  if (!isFocused) {
    return null
  }

  if (!user && loading) {
    return (
      <LoadingModal
        isLoading={loading}
        debugMessage={"from @EditProfile"}
      />
    )
  }

  return (
    <InnerEditProfile
      user={user}
      patch={patch}
      loading={loading}
      error={error}
      theme={theme}
      navigation={navigation}
    />
  )
}

function InnerEditProfile({ user, patch, loading, error, theme, navigation }) {
  const [numberOfGenres, setNumberOfGenres] = useState(user.genres.length);
  const isWeb = Boolean(Platform.OS === "web");

  const { control, handleSubmit, getValues, setValue, clearErrors } = useForm({
    defaultValues: {
      username: user.username,
      email: user.email,
      bio: user.bio,
      genres: user.genres,
      image: user.image,
    },
  });

  useEffect(() => {
    return () => {
      clearErrors();
    }
  }, []);

  const removeGenre = (genres, genreIDToRemove) => {
    const updatedGenres = genres.filter(genre => {return genre.id !== genreIDToRemove});
    setValue("genres", updatedGenres);
    setNumberOfGenres(updatedGenres.length);
  }

  let image = null;
  const onSubmit = async (data) => {
    /*
    NOTE! If an image is present first we upload string data using react-hook-form's
    data user then we upload image data separately afterwards using FormData.
     */

    if (typeof data.image === "string") {
      // Assume image has not been changed by user as URL from server.
      // EG: http://192.168.77.206:8000/media/user/6da64...
      return await patch(user.id, getDataWithOutImage(data), onSuccess)
    }

    image = data.image;
    if (image) {
      // Upload new image.
      await patch(user.id, getDataWithOutImage(data), upLoadImage)
    } else {
      // User wants to remove the image.
      await patch(user.id, data, onSuccess)
    }
  }

  const upLoadImage = async (user) => {
    const formData = new FormData();
    if (isWeb) {
      formData.append("image", image);
      await patch(user.id, formData, onSuccess, true);
    } else {
      const formattedImage = formatImageForForm(image.uri);
      formData.append("image", formattedImage);
      await patch(user.id, formData, onSuccess, true);
    }
  }

  const onSuccess = () => {
    navigation.navigate("ProfilePage")
    return () => {
      image = null
    }
  }

  const setImage = (image) => {
    setValue("image", image)
  }

  const removeImage = () => {
    setValue("image", null)
  }

  const parsedError = error || {};
  return (
    <CustomScrollViewWithOneButton
      buttonTitle={"submit"}
      buttonOnPress={handleSubmit(onSubmit)}
    >
      <LoadingModal isLoading={loading} debugMessage={"from @EditProfile"}/>
      {(parsedError.detail) && <Errors errorMessages={parsedError.detail} />}
      {(parsedError.unExpectedError) && <Errors errorMessages={parsedError.unExpectedError} />}
      {isWeb ? (
        <ImagePickerWeb
          setImage={setImage}
          removeImage={removeImage}
          existingImage={getValues("image")}
        />
        ) : (
        <ImagePickerMobile
          setImage={setImage}
          removeImage={removeImage}
          existingImage={getValues("image")}
        />
        )}
      {parsedError.image && <Errors errorMessages={parsedError.image} />}
      <Controller
        control={control}
        rules={{
         // required: true,
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            label={"username"}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
          />
        )}
        name="username"
      />
      {parsedError.username && <Errors errorMessages={parsedError.username} />}
      <Controller
        control={control}
        rules={{
         // required: true,
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            label={"email"}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
          />
        )}
        name="email"
      />
      {parsedError.email && <Errors errorMessages={parsedError.email} />}
      <Controller
        control={control}
        rules={{
         // required: true,
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            label={"about you"}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            // It is important to note that multiline aligns the text to the top on iOS,
            // and centers it on Android. Use with textAlignVertical set to top for
            // the same behavior in both platforms.
            multiline={true}
          />
        )}
        name="bio"
      />
      {parsedError.bio && <Errors errorMessages={parsedError.bio} />}
      {numberOfGenres ? (
        <DisplayGenres
          genres={getValues("genres")}
          removeGenre={removeGenre}
        />
        ) : null}
      <Controller
        control={control}
        rules={{
         // required: true,
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <SelectGenres
            onSelect={(selectedItem) => {
              const selectedGenres = getValues("genres");
              if (selectedGenres.map(genre => genre.id).includes(selectedItem.id)) {
                // Remove genre
                const filteredGenres = selectedGenres.filter(genre => genre.id !== selectedItem.id);
                onChange(filteredGenres);
                setNumberOfGenres(filteredGenres.length)
              } else {
                // Add genre
                selectedGenres.push(selectedItem);
                onChange(selectedGenres);
                setNumberOfGenres(selectedGenres.length)
              }
            }}
            selectedGenres={getValues("genres")}
            theme={theme}
          />
        )}
        name="genres"
      />
      {parsedError.genres && <Errors errorMessages={parsedError.genres} />}
    </CustomScrollViewWithOneButton>
  )
}

export default EditProfile;
