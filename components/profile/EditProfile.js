import useUserStore from "../../store/user";
import LoadingModal from "../loading/LoadingModal";
import Errors from "../forms/Errors";
import {Controller, useForm} from "react-hook-form";
import TextInput from "../forms/TextInput";
import SelectDropdown from "../SelectDropdown";
import useGenresStore from "../../store/genres";
import {useState} from "react";
import DisplayGenres from "../gig/DisplayGenres";
import CustomScrollViewWithTwoButtons from "../views/CustomScrollViewWithTwoButtons";

function EditProfile({ navigation }) {
  const { me, object, patch, loading, error } = useUserStore();
  const [numberOfGenres, setNumberOfGenres] = useState(object.genres.length);

  const {
    object: genres,
    search: searchGenres,
  } = useGenresStore();

  const { control, handleSubmit, getValues, setValue } = useForm({
    defaultValues: {
      username: object.username,
      email: object.email,
      bio: object.bio,
      genres: object.genres,
    },
  });

  const removeGenre = (genres, genreIDToRemove) => {
    const updatedGenres = genres.filter(genre => {return genre.id !== genreIDToRemove});
    setValue("genres", updatedGenres);
    setNumberOfGenres(updatedGenres.length);
  }

  const onSubmit = async (data) => {
    await patch(object.id, data, onSuccess);
  }

  const goBack = () => {
    me(object.id);
    navigation.goBack();
  }

  const onSuccess = () => {
    navigation.navigate("ProfilePage")
  }

  const parsedError = error || {};
  return (
    <CustomScrollViewWithTwoButtons
      actionButtonTitle={"submit"}
      actionButtonOnPress={handleSubmit(onSubmit)}
      backButtonTitle={"go back"}
      backButtonOnPress={goBack}
    >
      <LoadingModal isLoading={loading} />
      {(parsedError.detail) && <Errors errorMessages={parsedError.detail} />}
      {(parsedError.unExpectedError) && <Errors errorMessages={parsedError.unExpectedError} />}
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
    </CustomScrollViewWithTwoButtons>
  )
}

export default EditProfile;
