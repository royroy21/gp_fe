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
import {Platform, View} from "react-native";
import ImagePickerWeb from "../Image/ImagePickerWeb";
import SelectGenres from "../selectors/SelectGenres";
import {Switch, useTheme, Text} from "@react-native-material/core";
import {useIsFocused} from "@react-navigation/native";
import PleaseLoginMessage from "../loginSignUp/PleaseLoginMessage";
import SelectInstruments from "../selectors/SelectInstruments";
import DisplayInstruments from "../gig/DisplayInstruments";
import SelectCountry from "../selectors/SelectCountry";
import {DEFAULT_COUNTRY} from "../../settings";

function EditProfile({ navigation }) {
  const isFocused = useIsFocused();
  const theme = useTheme();

  const user = useUserStore((state) => state.object);
  const patch = useUserStore((state) => state.patch);
  const loading = useUserStore((state) => state.loading);
  const error = useUserStore((state) => state.error);

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
  const [isMusician, setIsMusician] = useState(false);
  const [numberOfGenres, setNumberOfGenres] = useState(user.genres.length);
  const [numberOfInstruments, setNumberOfInstruments] = useState(user.instruments.length);
  const isWeb = Boolean(Platform.OS === "web");

  const { control, handleSubmit, getValues, setValue, clearErrors } = useForm({
    defaultValues: {
      username: user.username,
      email: user.email,
      bio: user.bio,
      location: user.location,
      country: user.country || DEFAULT_COUNTRY,
      genres: user.genres,
      instruments: user.instruments,
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

  const removeInstrument = (instruments, instrumentIDToRemove) => {
    const updatedInstruments = instruments.filter(instrument => {return instrument.id !== instrumentIDToRemove});
    setValue("instruments", updatedInstruments);
    setNumberOfInstruments(updatedInstruments.length);
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
    navigation.push("ProfilePage")
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
      <Controller
        control={control}
        rules={{
         // required: true,
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            label={"city, town .."}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
          />
        )}
        name="location"
      />
      {parsedError.location && <Errors errorMessages={parsedError.location} />}
      <Controller
        control={control}
        rules={{
         // required: true,
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <SelectCountry
            defaultCountry={value}
            onSelect={onChange}
            theme={theme}
          />
        )}
        name="country"
      />
      {parsedError.country && <Errors errorMessages={parsedError.country} />}
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
            genresForDisplayGenres={getValues("genres")}
            selectedGenres={getValues("genres")}
            theme={theme}
          />
        )}
        name="genres"
      />
      {parsedError.genres && <Errors errorMessages={parsedError.genres} />}
      <View style={{marginTop: 10}}>
        <Text>{"Are you a musician?"}</Text>
        <Switch
          value={isMusician}
          onValueChange={() => setIsMusician(!isMusician)}
        />
      </View>
      {!numberOfInstruments && isMusician ? <View style={{marginTop: 10}}>{""}</View> : null}
      {numberOfInstruments && isMusician ? (
        <DisplayInstruments
          instruments={getValues("instruments")}
          removeInstrument={removeInstrument}
        />
        ) : null}
      {isMusician ? (
        <Controller
          control={control}
          rules={{
           // required: true,
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <SelectInstruments
              onSelect={(selectedItem) => {
                const selectedInstruments = getValues("instruments");
                if (selectedInstruments.map(instrument => instrument.id).includes(selectedItem.id)) {
                  // Remove instrument
                  const filteredInstruments = selectedInstruments.filter(instrument => instrument.id !== selectedItem.id);
                  onChange(filteredInstruments);
                  setNumberOfInstruments(filteredInstruments.length)
                } else {
                  // Add instrument
                  selectedInstruments.push(selectedItem);
                  onChange(selectedInstruments);
                  setNumberOfInstruments(selectedInstruments.length)
                }
              }}
              instrumentsForDisplayInstruments={getValues("instruments")}
              selectedInstruments={getValues("instruments")}
              theme={theme}
            />
          )}
          name="instruments"
        />
      ) : null}
      {parsedError.instruments && <Errors errorMessages={parsedError.instruments} />}
    </CustomScrollViewWithOneButton>
  )
}

export default EditProfile;
