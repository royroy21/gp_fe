import {Dimensions} from "react-native";

const windowWidth = Dimensions.get('window').width;

// Different percent used here based upon screen size.
export const formContainerPadding = windowWidth < 500 ? (windowWidth * 20)/100 : (windowWidth * 40)/100;
