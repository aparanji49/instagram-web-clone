import React, { useEffect, useState } from "react";
import { db } from "./firebaseconfig";
import "./Post.css";
import { Button } from "@mui/material";
import { Avatar } from '@mui/material';
import {addDoc, collection, onSnapshot, orderBy , serverTimestamp } from "firebase/firestore";
function Post({postId, user, username, caption, imageUrl}) {
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");

  useEffect(() => {
    let unsubscribe;
    if(postId){
      unsubscribe = onSnapshot(collection(db, "posts", postId, "comments"),
      orderBy('timestamp', 'desc'), (snapshot) => {
        setComments(snapshot.docs.map((doc) => doc.data()));
      }); 
    } else{
      //show no posts available yet
      return (
        <div className="no-posts-available">
          No posts available yet.
        </div>
      );
    }
  
    return () => {
      unsubscribe();
    }
  }, [postId]);
  
  const postComment = (event) => {
    event.preventDefault();
    addDoc(collection(db, "posts", postId, "comments"), {
      text: comment,
      username: user.displayName,
      timestamp: serverTimestamp()
     });
     setComment("");
  }

  return (
    <div className="post">
      <div className="post__header">
        <Avatar 
          className="post__avatar" 
          alt={username} 
          src="" 
          />
        <h3>{username}</h3>
        {/*header - image and username*/}
      </div>

      <img
        className="post__image"
        src={imageUrl}
        alt=""
      />

      {/*image*/}

      <h4 className="post__text">
        <strong>{username}</strong> {caption}
      </h4>

      {/*username and caption*/}

      <div className="post__comments">
        {comments.map((comment) => (
          <p>
            <strong>{comment.username}</strong> {comment.text}
          </p>
        ))

        }

      </div>
      {user && (
         <form className="post__commentBox">
        <input className="post__input"
        type="text" placeholder="Add a comment...."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        />
        <Button className="post__button" 
        disabled={!comment}
        type="submit"
        onClick={postComment}>Comment</Button>
      </form>
      )}
     
    </div>
  );
}

export default Post;
