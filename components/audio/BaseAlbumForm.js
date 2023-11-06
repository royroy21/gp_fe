import LoadingModal from "../loading/LoadingModal";
import CustomScrollViewWithOneButton from "../views/CustomScrollViewWithOneButton";
import ImagePickerWeb from "../Image/ImagePickerWeb";
import ImagePickerMobile from "../Image/ImagePickerMobile";
import Errors from "../forms/Errors";
import {Controller} from "react-hook-form";
import TextInput from "../forms/TextInput";
import DisplayGenres from "../gig/DisplayGenres";
import SelectGenres from "../selectors/SelectGenres";
import {useTheme} from "@react-native-material/core";
import {useEffect} from "react";

function BaseAlbumForm(props) {
  const {
    isWeb,
    control,
    handleSubmit,
    getValues,
    setValue,
    loading,
    error,
    clearErrors,
    numberOfGenres,
    setNumberOfGenres,
    onSubmit,
  } = props;

  const theme = useTheme();

  useEffect(() => {
    return () => {
      clearErrors();
    }
  }, []);

  const setImage = (image) => {
    setValue("image", image)
  }

  const removeImage = () => {
    setValue("image", null)
  }

  const removeGenre = (genres, genreIDToRemove) => {
    const updatedGenres = genres.filter(genre => {return genre.id !== genreIDToRemove});
    setValue("genres", updatedGenres);
    setNumberOfGenres(updatedGenres.length);
  }

  const parsedError = error || {};
  return (
    <CustomScrollViewWithOneButton
      buttonTitle={"submit"}
      buttonOnPress={handleSubmit(onSubmit)}
    >
      <LoadingModal isLoading={loading} debugMessage={"from @BaseAlbumForm"}/>
      {(parsedError.detail) && <Errors errorMessages={parsedError.detail} />}
      {(parsedError.unExpectedError) && <Errors errorMessages={parsedError.unExpectedError} />}
      {parsedError.gig && <Errors errorMessages={parsedError.gig} />}
      {parsedError.profile && <Errors errorMessages={parsedError.profile} />}
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
            label={"title"}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
          />
        )}
        name="title"
      />
      {parsedError.title && <Errors errorMessages={parsedError.title} />}
      <Controller
        control={control}
        rules={{
         // required: true,
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            label={"description"}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            // It is important to note that multiline aligns the text to the top on iOS,
            // and centers it on Android. Use with textAlignVertical set to top for
            // the same behavior in both platforms.
            multiline={true}
          />
        )}
        name="description"
      />
      {parsedError.description && <Errors errorMessages={parsedError.description} />}
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

export default BaseAlbumForm;
