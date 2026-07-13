import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "./firebase";

export async function uploadImage(file, path = "products") {
  const fileName = `${path}/${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.]/g, "_")}`;
  const storageRef = ref(storage, fileName);

  await uploadBytes(storageRef, file);
  const url = await getDownloadURL(storageRef);
  return url;
}

export async function uploadImages(files, path = "products") {
  const urls = [];
  for (const file of files) {
    const url = await uploadImage(file, path);
    urls.push(url);
  }
  return urls;
}
