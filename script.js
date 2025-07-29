import { auth, db, storage } from './firebase-config.js';
import {
  collection, addDoc, serverTimestamp,
  onSnapshot, query, orderBy
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import {
  ref, uploadBytes, getDownloadURL
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js";

const postsCol = collection(db, "posts");

window.createPost = async () => {
  const text = document.getElementById("postText").value;
  const file = document.getElementById("postImage").files[0];

  let imageUrl = "";
  if (file) {
    const storageRef = ref(storage, 'images/' + Date.now());
    await uploadBytes(storageRef, file);
    imageUrl = await getDownloadURL(storageRef);
  }

  await addDoc(postsCol, {
    text,
    imageUrl,
    time: serverTimestamp(),
    uid: auth.currentUser?.uid || "anon"
  });

  document.getElementById("postText").value = "";
  document.getElementById("postImage").value = "";
};

const postDiv = document.getElementById("posts");
onSnapshot(query(postsCol, orderBy("time", "desc")), (snapshot) => {
  postDiv.innerHTML = "";
  snapshot.forEach(doc => {
    const data = doc.data();
    postDiv.innerHTML += `
      <div class="post">
        <p>${data.text}</p>
        ${data.imageUrl ? `<img src="${data.imageUrl}" width="200">` : ""}
        <small>${data.uid}</small>
      </div>
    `;
  });
});
