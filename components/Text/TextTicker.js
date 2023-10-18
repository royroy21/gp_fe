import ReactNativeTextTicker from "react-native-text-ticker";

function TextTicker({children, style}) {
  return (
    <ReactNativeTextTicker
      style={style}
      duration={15000}
      marqueeDelay={1000}
    >
      {children}
    </ReactNativeTextTicker>
  )
}

export default TextTicker;
