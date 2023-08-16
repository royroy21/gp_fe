import useUserStore from "../../store/user";
import LoadingModal from "../loading/LoadingModal";
import Errors from "../forms/Errors";
import {Controller, useForm} from "react-hook-form";
import TextInput from "../forms/TextInput";
import SelectDropdown from "../SelectDropdown";
import useGenresStore from "../../store/genres";
import {useEffect, useState} from "react";
import DisplayGenres from "../gig/DisplayGenres";
import ImagePicker from "../Image/ImagePicker";
import {formatImageForForm, getDataWithOutImage} from "../Image/helpers";
import CustomScrollViewWithOneButton from "../views/CustomScrollViewWithOneButton";

function EditProfile({ navigation }) {
  const { me, object, patch, loading, error } = useUserStore();
  const [numberOfGenres, setNumberOfGenres] = useState(object.genres.length);

  const {
    object: genres,
    search: searchGenres,
  } = useGenresStore();

  const { control, handleSubmit, getValues, setValue, clearErrors } = useForm({
    defaultValues: {
      username: object.username,
      email: object.email,
      bio: object.bio,
      genres: object.genres,
      image: object.image,
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
    data object then we upload image data separately afterwards using FormData.
     */

    if (typeof data.image === "string") {
      // Assume image has not been changed by user as URL from server.
      // EG: http://192.168.77.206:8000/media/user/6da64...
      return await patch(object.id, getDataWithOutImage(data), onSuccess)
    }

    image = data.image;
    if (image) {
      // Upload new image.
      await patch(object.id, getDataWithOutImage(data), upLoadImage)
    } else {
      // User wants to remove the image.
      await patch(object.id, data, onSuccess)
    }
  }

  const upLoadImage = async (object) => {
    console.log("@upLoadImage: ", object);
    const formData = new FormData();
    const formattedImage = formatImageForForm(image.uri);
    formData.append("image", formattedImage);
    await patch(object.id, formData, onSuccess, true);
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
      <LoadingModal isLoading={loading} />
      {(parsedError.detail) && <Errors errorMessages={parsedError.detail} />}
      {(parsedError.unExpectedError) && <Errors errorMessages={parsedError.unExpectedError} />}
      <ImagePicker
        setImage={setImage}
        removeImage={removeImage}
        existingImage={getValues("image")}
      />
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
          <SelectDropdown
            data={genres}
            defaultValue={value}
            onSelect={(selectedItem) => {
              const selectedGenres = getValues("genres");
              if (selectedGenres.map(genre => genre.id).includes(selectedItem.id)) {
                return
              }
              selectedGenres.push(selectedItem);
              onChange(selectedGenres);
              setNumberOfGenres(selectedGenres.length)
            }}
            buttonTextAfterSelection={(selectedItem, index) => {
              return "select more genres?"
            }}
            rowTextForSelection={(item, index) => {
              return item.genre
            }}
            defaultButtonText={"add genres you're into?"}
            searchPlaceHolder={"Search Genres"}
            onChangeSearchInputText={(query) => searchGenres(query)}
          />
        )}
        name="genres"
      />
      {parsedError.genres && <Errors errorMessages={parsedError.genres} />}
    </CustomScrollViewWithOneButton>
  )
}

export default EditProfile;
