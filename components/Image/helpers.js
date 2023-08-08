export const formatImageForForm = (uri) => {
  return  {
    uri,
    type: "image/" + getImageTypeFromUri(uri),
    name: getImageNameFromUri(uri),
  }
}

const getImageTypeFromUri = (uri) => {
  const splitUri = uri.split(".");
  return splitUri[splitUri.length - 1];
}

const getImageNameFromUri = (uri) => {
  const splitUri = uri.split("/");
  return splitUri[splitUri.length - 1];
}

export const getDataWithOutImage = (data) => {
  const dataWithoutImage = {};
  Object.entries(data).forEach(([key, value]) => {
    if (key !== "image") {
      dataWithoutImage[key] = value;
    }
  })
  return dataWithoutImage;
}
