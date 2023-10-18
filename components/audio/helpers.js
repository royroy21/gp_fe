export const formatAudioForForm = (uri) => {
  // Formats an audio to be uploaded.
  // This is only necessary if uploading from mobile.
  return  {
    uri,
    type: "audio/" + getAudioTypeFromUri(uri),
    name: getAudioNameFromUri(uri),
  }
}

const getAudioTypeFromUri = (uri) => {
  const splitUri = uri.split(".");
  return splitUri[splitUri.length - 1];
}

export const getAudioNameFromUri = (uri) => {
  const splitUri = uri.split("/");
  return splitUri[splitUri.length - 1];
}

export const getDataWithOutImageAndFile = (data) => {
  const dataWithoutImage = {};
  Object.entries(data).forEach(([key, value]) => {
    if (!(["image", "file"].includes(key))) {
      dataWithoutImage[key] = value;
    }
  })
  return dataWithoutImage;
}

export const getDataWithOutFile = (data) => {
  const dataWithoutImage = {};
  Object.entries(data).forEach(([key, value]) => {
    if (key !== "file") {
      dataWithoutImage[key] = value;
    }
  })
  return dataWithoutImage;
}
