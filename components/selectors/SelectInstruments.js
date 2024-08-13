import {IconButton, ListItem, TextInput} from "@react-native-material/core";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import {Dimensions, ScrollView, View} from "react-native";
import {useCallback, useState} from "react";
import CenteredModalWithOneButton from "../centeredModal/CenteredModalWithOneButton";
import {useFocusEffect} from "@react-navigation/native";
import useInstrumentsStore from "../../store/instruments";
import DisplayInstruments from "../gig/DisplayInstruments";

function ShowInstrument({instrument, onSelect, isSelected, theme}) {
  const onPress = () => {onSelect(instrument)}
  return (
    <ListItem
      title={instrument.instrument}
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

function SelectInstrumentsModal(props) {
  const windowHeight = Dimensions.get("window").height;
  const {
    showModal,
    setModal,
    instruments,
    instrumentsForDisplayInstruments,
    searchInstruments,
    onInstrumentsSelect,
    selectedInstruments,
    theme,
  } = props;
  return (
    <CenteredModalWithOneButton showModal={showModal} setModal={setModal} >
      <DisplayInstruments instruments={instrumentsForDisplayInstruments}/>
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
        onChangeText={searchInstruments}
        style={{paddingTop: 5}}
      />
      {instruments ? (
      <ScrollView
        keyboardShouldPersistTaps={"always"}
        style={{height: windowHeight / 4}}
      >
        {instruments.map(item => (
          <ShowInstrument
            key={item.id}
            instrument={item}
            onSelect={onInstrumentsSelect}
            isSelected={selectedInstruments.map(instrument => instrument.id).includes(item.id)}
            theme={theme}
          />
        ))}
      </ScrollView>
      ) : null}
    </CenteredModalWithOneButton>
  )
}

function SelectInstruments({onSelect, instrumentsForDisplayInstruments, selectedInstruments, theme}) {
  const [showModal, setModal] = useState(false);

  const instruments = useInstrumentsStore((state) => state.object);
  const searchInstruments = useInstrumentsStore((state) => state.search);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      if (!isActive) {
        return
      }
      // Populate instruments array with the first instrument available.
      if (selectedInstruments.length) {
        searchInstruments(selectedInstruments[0].instrument);
      }

      return () => {
        isActive = false;
      };
    }, [])
  );

  return (
    <View>
      <ListItem
        title={`select instruments`}
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
      <SelectInstrumentsModal
        showModal={showModal}
        setModal={setModal}
        instruments={instruments}
        instrumentsForDisplayInstruments={instrumentsForDisplayInstruments}
        searchInstruments={searchInstruments}
        onInstrumentsSelect={onSelect}
        selectedInstruments={selectedInstruments}
        theme={theme}
      />
    </View>
  )
}

export default SelectInstruments;
