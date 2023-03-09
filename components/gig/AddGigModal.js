import {Modal} from "react-native";
import {useContext, useState} from "react";
import {UserContext} from "../context/user";
import getCountry from "../location/getCountry";
import {DEFAULT_COUNTRY_CODE} from "../../settings";
import searchCountries from "../location/searchCountries";
import AddGigForm from "./AddGigForm";
import LoadingModal from "../loading/LoadingModal";

function AddGigModal({showAddGig, setShowAddGig}) {
  const { user } = useContext(UserContext);
  const [loading, setLoading] = useState(false);
  const [defaultCountry, setDefaultCountry] = useState(false);
  const [countries, setCountries] = useState(false);

  const getCountryDefaults = async () => {
    setLoading(true);
    if (user && user.country) {
      await getCountry(user.country.code, setDefaultCountry);
      await searchCountries(user.country.code, setCountries);
    } else {
      await getCountry(DEFAULT_COUNTRY_CODE, setDefaultCountry);
      await searchCountries(DEFAULT_COUNTRY_CODE, setCountries);
    }
    setLoading(false);
  }

  return (
    <Modal
      animationType={"slide"}
      transparent={true}
      visible={showAddGig}
      onRequestClose={() => setShowAddGig(false)}
      onShow={getCountryDefaults}
    >
      {!loading ? (
        <AddGigForm
          defaultCountry={defaultCountry}
          countries={countries}
          setCountries={setCountries}
          setShowAddGig={setShowAddGig}
        />
      ) : (
        <LoadingModal isLoading={loading} />
      )}
    </Modal>
  )
}

export default AddGigModal;
