import { auth, db, storage } from './firebase-config.js';
import {
  collection, addDoc, serverTimestamp,
  onSnapshot, query, orderBy, doc,
  updateDoc, arrayUnion
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import {
  ref, uploadBytes, getDownloadURL
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js";
import { signOut } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

const postsCol = collection(db, "posts");

window.logout = async () => {
  await signOut(auth);
  location.href = 'login.html';
};

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
    uid: auth.currentUser?.uid || "anon",
    likes: [],
    comments: []
  });

  document.getElementById("postText").value = "";
  document.getElementById("postImage").value = "";
};

const postDiv = document.getElementById("posts");
onSnapshot(query(postsCol, orderBy("time", "desc")), (snapshot) => {
  postDiv.innerHTML = "";
  snapshot.forEach(docSnap => {
    const data = docSnap.data();
    const id = docSnap.id;
    const postEl = document.createElement("div");
    postEl.className = "post";
    postEl.innerHTML = `
      <p>${data.text}</p>
      ${data.imageUrl ? `<img src="${data.imageUrl}">` : ""}
      <small>${data.uid}</small><br>
      <button onclick="likePost('${id}')">👍 (${data.likes.length})</button>
      <div class="comment-box">
        <input id="comment-${id}" placeholder="Write a comment...">
        <button onclick="addComment('${id}')">Comment</button>
      </div>
      <div>${data.comments.map(c => `<p><b>${c.uid}</b>: ${c.text}</p>`).join('')}</div>
    `;
    postDiv.appendChild(postEl);
  });
});

window.likePost = async (id) => {
  const postRef = doc(db, "posts", id);
  await updateDoc(postRef, {
    likes: arrayUnion(auth.currentUser?.uid || "anon")
  });
};

window.addComment = async (id) => {
  const commentInput = document.getElementById("comment-" + id);
  const postRef = doc(db, "posts", id);
  await updateDoc(postRef, {
    comments: arrayUnion({
      uid: auth.currentUser?.uid || "anon",
      text: commentInput.value
    })
  });
  commentInput.value = "";
};
