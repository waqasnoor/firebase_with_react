import React, { useState, useEffect } from "react";

import Posts from "./Posts";
import { firestore } from "../firebase";

const Application = () => {
  const [posts, setPosts] = useState([]);
  const handleCreate = (post) => {
    firestore
      .collection("posts")
      .add(post)
      .then((ref) => {
        setPosts([{ id: ref.id, ...post }, ...posts]);
      });
  };
  const handleRemove = (id) => () => {
    firestore
      .doc(`posts/${id}`)
      .delete()
      .then(() => {
        setPosts(posts.filter((post) => post.id !== id));
      });
  };
  useEffect(() => {
    async function getPosts() {
      const snapshot = await firestore.collection("posts").get();
      const posts = snapshot.docs.map((doc) => {
        const { id } = doc;
        const data = doc.data();
        return { id, ...data };
      });
      setPosts(posts);
    }

    getPosts();
  }, []);

  return (
    <main className="Application">
      <h1>Think Piece</h1>
      <Posts posts={posts} onCreate={handleCreate} onRemove={handleRemove} />
    </main>
  );
};

export default Application;
