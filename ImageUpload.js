import { Button } from "@mui/material";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { useState } from "react";
import { storage, db } from "./firebaseconfig";

import "./ImageUpload.css";
function ImageUpload({username}) {
    const [progress, setProgress] = useState(0);
    const [caption, setCaption] = useState("");
    const [image, setImage] = useState(null);
    

    const handleCreate = () => {

      // const uploadTask = storage.ref(`images/${image.name}`).put(image);
      // uploadTask.on(
      //   "state_changed",
      //   (snapshot) => {
      //     // progess logic
      //     const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);

      //     setProgress(progress);
      //   },
      //   (error) =>{
      //     // error function
      //     console.log(error);
      //   },
      //   ()=>{
      //     // complete 
      //     storage.ref("images").child(image.name).getDownloadURL().then(url => {
      //       // post image url in db
      //       db.collection("posts").add({o
      //         timestamp: serverTimestamp(),
      //         caption: caption,
      //         imageUrl: url,
      //         username: username
      //       });
            
      //       setImage(null);
      //      setProgress(0);
      //      setCaption("");
      //     })

      //   }
      // )

      const imageRef = ref(storage, `images/${image.name}`);
      //`images/${image.name}`

      const uploadTask = uploadBytesResumable(imageRef,image);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log('Upload is ' + progress + '% done');
          setProgress(progress);
        }, 
        (error) => {
          console.log(error);
          alert(error.message);
          
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          addDoc(collection(db, "posts"), {
            timestamp: serverTimestamp(),
            caption: caption,
            imageUrl: downloadURL,
            username: username
           });
           setImage(null);
           setProgress(0);
           setCaption("");
           
          });

        }
      )
        
    };

    const handleChange = (e) => {
      // console.log(e.target.files[0]);
      if(e.target.files[0]){
        setImage(e.target.files[0]);
      } 
      // else {
      //   setImage(null);
      // }
    };

  return (
    <div className="imageUpload">
   
      <form className="imageUpload__createPost">
      
       <h4>Create Post</h4>
        <input type="text" placeholder="Enter a caption..." onChange={event => setCaption(event.target.value)} value={caption} />
        <input type="file" onChange={handleChange} />
       
        {/*Progress bar*/}
        <progress value={progress} max="100"/>
        <Button onClick={handleCreate}>Post</Button>
      
      </form>
      
    
      
    </div>
  );
}

export default ImageUpload;
