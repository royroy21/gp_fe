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
import {Switch, useTheme, Text, Icon} from "@react-native-material/core";
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
  const [isBand, setIsBand] = useState(user.is_band);
  const [isMusician, setIsMusician] = useState(user.is_musician);
  const [lookingForMusicians, setLookingForMusicians] = useState(user.is_looking_for_musicians);
  const [lookingForBand, setLookingForBand] = useState(user.is_looking_for_band);

  const [numberOfGenres, setNumberOfGenres] = useState(user.genres.length);
  const [numberOfInstruments, setNumberOfInstruments] = useState(user.instruments.length);
  const [numberOfInstrumentsNeeded, setNumberOfInstrumentsNeeded] = useState(user.instruments_needed.length);

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
      instruments_needed: user.instruments_needed,
      is_band: user.is_band,
      is_musician: user.is_musician,
      is_looking_for_musicians: user.is_looking_for_musicians,
      is_looking_for_band: user.is_looking_for_band,
      image: user.image,
    },
  });

  useEffect(() => {
    return () => {
      clearErrors();
    }
  }, []);

  useEffect(() => {
    if (isBand) {
      if (isMusician) {
        setIsMusician(false);
      }
      if (lookingForBand) {
        setLookingForBand(false);
      }
    }
  }, [isBand]);

  useEffect(() => {
    if (isMusician) {
      if (isBand) {
        setIsBand(false);
      }
    } else {
      setLookingForBand(false);
    }
  }, [isMusician]);

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

  const removeInstrumentNeeded = (instruments, instrumentIDToRemove) => {
    const updatedInstruments = instruments.filter(instrument => {return instrument.id !== instrumentIDToRemove});
    setValue("instruments_needed", updatedInstruments);
    setNumberOfInstrumentsNeeded(updatedInstruments.length);
  }

  let image = null;
  const onSubmit = async (data) => {
    data.is_band = isBand;
    data.is_looking_for_musicians = lookingForMusicians;
    if (!lookingForMusicians) {
      data.instruments_needed = []
    }

    data.is_musician = isMusician;
    data.is_looking_for_band = lookingForBand;

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
      <View style={{marginBottom: 10}}>
        <Text>{"Are you band?"}</Text>
        <View style={{flexDirection: "row"}}>
          <Switch
            value={isBand}
            onValueChange={() => {
              setIsBand(!isBand);
            }}
          />
          {isBand ? (
            <Icon
              color={theme.palette.secondary.main}
              name={"check"}
              size={18}
              style={{marginLeft: 5}}
            />
          ) : null}
        </View>
      </View>
      <View style={{marginBottom: 10}}>
        <Text>{"Are looking for musicians?"}</Text>
        <View style={{flexDirection: "row"}}>
          <Switch
            value={lookingForMusicians}
            onValueChange={() => {
              setLookingForMusicians(!lookingForMusicians);
            }}
          />
          {lookingForMusicians ? (
            <Icon
              color={theme.palette.secondary.main}
              name={"check"}
              size={18}
              style={{ marginLeft: 5 }}
            />
          ) : null}
        </View>
      </View>
      {numberOfInstrumentsNeeded && lookingForMusicians ? (
        <DisplayInstruments
          instruments={getValues("instruments_needed")}
          removeInstrument={removeInstrumentNeeded}
        />
        ) : null}
      {lookingForMusicians ? (
        <Controller
          control={control}
          rules={{
           // required: true,
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <SelectInstruments
              containerStyle={isBand ? {marginBottom: 20} : {}}
              title={"Select musicians needed"}
              onSelect={(selectedItem) => {
                const selectedInstruments = getValues("instruments_needed");
                if (selectedInstruments.map(instrument => instrument.id).includes(selectedItem.id)) {
                  // Remove instrument
                  const filteredInstruments = selectedInstruments.filter(instrument => instrument.id !== selectedItem.id);
                  onChange(filteredInstruments);
                  setNumberOfInstrumentsNeeded(filteredInstruments.length)
                } else {
                  // Add instrument
                  selectedInstruments.push(selectedItem);
                  onChange(selectedInstruments);
                  setNumberOfInstrumentsNeeded(selectedInstruments.length)
                }
              }}
              instrumentsForDisplayInstruments={getValues("instruments_needed")}
              selectedInstruments={getValues("instruments_needed")}
              theme={theme}
            />
          )}
          name="instruments_needed"
        />
      ) : null}
      {parsedError.instruments_needed && <Errors errorMessages={parsedError.instruments_needed} />}
      <View style={{marginBottom: 10}}>
        <Text>{"Are you a musician?"}</Text>
        <View style={{ flexDirection: "row" }}>
          <Switch
            value={isMusician}
            onValueChange={() => {
              setIsMusician(!isMusician);
            }}
          />
        {isMusician ? (
          <Icon
            color={theme.palette.secondary.main}
            name={"check"}
            size={18}
            style={{ marginLeft: 5 }}
          />
        ) : null}
        </View>
      </View>
      {numberOfInstruments && isMusician && !isBand ? (
        <DisplayInstruments
          instruments={getValues("instruments")}
          removeInstrument={removeInstrument}
        />
        ) : null}
      {isMusician && !isBand ? (
        <Controller
          control={control}
          rules={{
           // required: true,
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <SelectInstruments
              containerStyle={isMusician ? {marginBottom: 20} : {}}
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
      <View style={{marginBottom: 10}}>
        <Text style={ !isMusician ? { color: "grey" } : undefined }>{"Are looking for a band?"}</Text>
        <View style={{flexDirection: "row"}}>
          <Switch
            value={lookingForBand}
            disabled={!isMusician}
            onValueChange={() => {
              setLookingForBand(!lookingForBand);
            }}
          />
          {lookingForBand ? (
            <Icon
              color={theme.palette.secondary.main}
              name={"check"}
              size={18}
              style={{ marginLeft: 5 }}
            />
          ) : null}
        </View>
      </View>
      <Controller
        control={control}
        rules={{
         // required: true,
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            label={isBand ? "band name" : "username"}
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
            label={isBand ? "about band" : "about you"}
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
    </CustomScrollViewWithOneButton>
  )
}

export default EditProfile;
