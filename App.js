import "./App.css";
import Post from "./Post";
import { useState, useEffect } from "react";
import { db, auth } from "./firebaseconfig";
import { collection, onSnapshot, orderBy } from "firebase/firestore";
import { Box, Button, Modal, TextField } from "@mui/material";
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, updateProfile } from "firebase/auth";
import ImageUpload from "./ImageUpload";

//style for modal
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

function App() {
  // posts state
  const [posts, setPosts] = useState([]);
  // signin popup open and close states 
  const [open, setOpen] = useState(false);
  const [openSignIn, setOpenSignIn] = useState(false);
  // signup and signin popup fields states
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // state - user is loggedin or not
  const [user, setUser] = useState(null);

  // state handler functions
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleOpenSignIn = () => setOpenSignIn(true);
  const handleCloseSignIn = () => setOpenSignIn(false);


  //authorization
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, authUser => {
      if(authUser){
        //user logged in
        console.log(authUser);
        setUser(authUser);

        
      }else{
        //user is logged out
        setUser(null);
      }

      
    })
    return () => {
    // perform cleanup actions
    unsubscribe();
    }
  }, [user, username]);


//get posts
  useEffect(() => {
    onSnapshot(collection(db, "posts"), orderBy('timestamp','asc'), (snapshot) => {
      setPosts(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          post: doc.data(),
        }))
      );
    });
  }, []);


  //signup
  const signUp = (event) => {
    event.preventDefault();

    createUserWithEmailAndPassword(auth, email, password)
    .then((authUser) => {
      return updateProfile(authUser.user, {
        displayName: username,
      })
    })
    .catch((error) => alert(error.message));

    setOpen(false);
  }

//sign in
const signIn = (event) => {
  event.preventDefault();

  signInWithEmailAndPassword(auth,email,password)
  .catch((error) => alert(error.message));

  setOpenSignIn(false);

}
  
  return (
    <div className="app">
      <div className="app__header">
        <img
          className="app__headerImage"
          src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
          alt="Logo"
        />
        <div className="app__signbutton">
          {user ? (
            <Button onClick={() => auth.signOut()}>LogOut</Button>    
          ):(
            <div className="app__logincontainer">
               <Button onClick={handleOpenSignIn}>Sign In</Button>
               <Button onClick={handleOpen}>Sign Up</Button>
            </div>
           
          )}
          
          
          <Modal open={open} onClose={handleClose}>
            <Box sx={style}>
            <form className="app__signup">
            <center>
                <img
                  className="app__headerImage"
                  src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
                  alt="Logo"
                />
                </center>
                <TextField
                  label="Username"
                  variant="standard"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                <TextField
                  label="Email"
                  variant="standard"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <TextField
                  label="Password"
                  variant="standard"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Button onClick={signUp}>Sign Up</Button>
             
            </form>
              
            </Box>
          </Modal>
          <Modal open={openSignIn} onClose={handleCloseSignIn}>
            <Box sx={style}>
            <form className="app__signup">
            <center>
                <img
                  className="app__headerImage"
                  src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
                  alt="Logo"
                />
                </center>
                
                <TextField
                  label="Email"
                  variant="standard"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <TextField
                  label="Password"
                  variant="standard"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Button onClick={signIn}>Sign In</Button>
             
            </form>
              
            </Box>
          </Modal>
        </div>
      </div>
      {/*user can upload only when signed In*/}
      {user?.displayName ? (
        <ImageUpload username={user.displayName}/>
      ):(
       <center><h3>You need to login to upload</h3></center> 
      )}

      <div className="app__posts">
        {posts.map(({ id, post }) => (
        <Post
          key={id}
          postId={id}
          user={user}
          username={post.username}
          caption={post.caption}
          imageUrl={post.imageUrl}
        />
      ))}
      </div>      
      
    </div>
  );
}

export default App;
