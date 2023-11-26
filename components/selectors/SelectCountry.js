import {IconButton, ListItem, TextInput} from "@react-native-material/core";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import {Dimensions, ScrollView, StyleSheet, View} from "react-native";
import useCountriesStore from "../../store/countries";
import {useCallback, useState} from "react";
import CenteredModalWithOneButton from "../centeredModal/CenteredModalWithOneButton";
import {useFocusEffect} from "@react-navigation/native";

function ShowCountry({country, onSelect}) {
  const onPress = () => {onSelect(country)}
  return (
    <ListItem
      title={`${country.country} (${country.code})`}
      onPress={onPress}
    />
  )
}

function SelectCountryModal(props) {
  const windowHeight = Dimensions.get("window").height;
  const {
    showModal,
    setModal,
    countries,
    searchCountries,
    onCountrySelect,
    theme,
  } = props;
  return (
    <CenteredModalWithOneButton showModal={showModal} setModal={setModal} >
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
        onChangeText={searchCountries}
      />
      {countries ? (
      <ScrollView
        style={{height: windowHeight / 4}}
        keyboardShouldPersistTaps={"always"}
      >
        {countries.map(item => (
          <ShowCountry
            key={item.id}
            country={item}
            onSelect={onCountrySelect}
          />
        ))}
      </ScrollView>
      ) : null}
    </CenteredModalWithOneButton>
  )
}

function SelectCountry({defaultCountry, onSelect, theme}) {
  const [selectedCountry, setSelectedCountry] = useState(defaultCountry);
  const [showModal, setModal] = useState(false);

  const {
    object: countries,
    search: searchCountries,
  } = useCountriesStore();

  const onCountrySelect = (country) => {
    onSelect(country);
    setSelectedCountry(country);
    setModal(false);
  }

  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      if (!isActive) {
        return
      }
      // Populate countries array.
      searchCountries(defaultCountry.country);

      return () => {
        isActive = false;
      };
    }, [])
  );

  return (
    <View style={styles.container}>
      <ListItem
        title={`select country: ${selectedCountry.country}`}
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
      <SelectCountryModal
        showModal={showModal}
        setModal={setModal}
        countries={countries}
        searchCountries={searchCountries}
        onCountrySelect={onCountrySelect}
        theme={theme}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 2,
  },
});

export default SelectCountry;
