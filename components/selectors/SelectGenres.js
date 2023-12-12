import {IconButton, ListItem, TextInput} from "@react-native-material/core";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import {Dimensions, ScrollView, View} from "react-native";
import {useCallback, useState} from "react";
import CenteredModalWithOneButton from "../centeredModal/CenteredModalWithOneButton";
import {useFocusEffect} from "@react-navigation/native";
import useGenresStore from "../../store/genres";
import DisplayGenres from "../gig/DisplayGenres";

function ShowGenre({genre, onSelect, isSelected, theme}) {
  const onPress = () => {onSelect(genre)}
  return (
    <ListItem
      title={genre.genre}
      onPress={onPress}
      leadingMode={"icon"}
      leading={isSelected ? (
        <Icon
          name={"music-note"}
          size={25}
          color={theme.palette.secondary.main}
        />
      ) : null}
    />
  )
}

function SelectGenresModal(props) {
  const windowHeight = Dimensions.get("window").height;
  const {
    showModal,
    setModal,
    genres,
    genresForDisplayGenres,
    searchGenres,
    onGenresSelect,
    selectedGenres,
    theme,
  } = props;
  return (
    <CenteredModalWithOneButton showModal={showModal} setModal={setModal} >
      <DisplayGenres genres={genresForDisplayGenres}/>
      <TextInput
        variant={"outlined"}
        trailing={
          <IconButton
            icon={
              <Icon
                name={"magnify"}
                size={25}
                color={theme.palette.secondary.main}
              />
            }
          />
        }
        onChangeText={searchGenres}
        style={{paddingTop: 5}}
      />
      {genres ? (
      <ScrollView
        keyboardShouldPersistTaps={"always"}
        style={{height: windowHeight / 4}}
      >
        {genres.map(item => (
          <ShowGenre
            key={item.id}
            genre={item}
            onSelect={onGenresSelect}
            isSelected={selectedGenres.map(genre => genre.id).includes(item.id)}
            theme={theme}
          />
        ))}
      </ScrollView>
      ) : null}
    </CenteredModalWithOneButton>
  )
}

function SelectGenres({onSelect, genresForDisplayGenres, selectedGenres, theme}) {
  const [showModal, setModal] = useState(false);

  const genres = useGenresStore((state) => state.object);
  const searchGenres = useGenresStore((state) => state.search);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      if (!isActive) {
        return
      }
      // Populate genres array with the first genre available.
      if (selectedGenres.length) {
        searchGenres(selectedGenres[0].genre);
      }

      return () => {
        isActive = false;
      };
    }, [])
  );

  return (
    <View>
      <ListItem
        title={`select genres`}
        onPress={() => setModal(true)}
        trailing={
          <IconButton
            onPress={() => setModal(true)}
            icon={
              <Icon
                style={{marginRight: 8}}
                name={"chevron-down"}
                size={25}
                color={theme.palette.secondary.main}
              />
            }
          />
        }
      />
      <SelectGenresModal
        showModal={showModal}
        setModal={setModal}
        genres={genres}
        genresForDisplayGenres={genresForDisplayGenres}
        searchGenres={searchGenres}
        onGenresSelect={onSelect}
        selectedGenres={selectedGenres}
        theme={theme}
      />
    </View>
  )
}

export default SelectGenres;
