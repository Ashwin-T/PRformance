import { useState } from "react";
import { writeBatch, doc, getDoc, getFirestore, arrayUnion} from "firebase/firestore"; 
import { getAuth } from "firebase/auth";
import { getStorage, ref, uploadBytesResumable, getDownloadURL} from "firebase/storage";
import {FaCamera, FaCheck} from 'react-icons/fa';
import {TiArrowBack} from 'react-icons/ti';
import './add.css';
const Add = () => {

    const [option, setOption] = useState(0);
    const [name, setName] = useState('Enter A Name');
    const [imageAsFile, setImageAsFile] = useState('')

    const [caption, setCaption] = useState('Enter A Caption');

    const handleFollow = async() => {
        const docRef = doc(getFirestore(), "allUsers", name);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const followeeUid = docSnap.data().uid;
            const followerUid = getAuth().currentUser.uid;
            const batch = writeBatch(getFirestore());
            batch.update(doc(getFirestore(), "users", followeeUid), {
                followers: arrayUnion(followerUid),
                notifications: arrayUnion(name + " has started following you")
            })
            batch.update(doc(getFirestore(), "users", followerUid), {
                follows: arrayUnion(followeeUid)
            })


            batch.commit();
            alert("You are now following " + name);
            window.location.reload();

        }
        else {
            alert("That user does not exist, check your spelling maybe?");
        }
    }
    const handlePost = async() => {

        const uid = getAuth().currentUser.uid;
        let text = "";
        const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      
        for (let i = 0; i < 15; i++)
          text += possible.charAt(Math.floor(Math.random() * possible.length));

        const storage = getStorage();
        // const url = text + ".png"
        const picStorageRef = ref(storage, imageAsFile.name); 

        // const httpsReference = 'https://firebasestorage.googleapis.com/b/bucket/o/' + url

        await uploadBytesResumable(picStorageRef, imageAsFile);

        getDownloadURL(ref(storage, imageAsFile.name))
        .then((url) => {

            const batchData = async(urlImage)=>{
                const batch = writeBatch(getFirestore());

                const docRef = doc(getFirestore(), "users", getAuth().currentUser.uid);
                const docSnap = await getDoc(docRef);
            
                if (docSnap.exists()) {
                    const followers = docSnap.data().followers;
                    followers.forEach(follower => {
                        console.log(follower);
                        batch.update(doc(getFirestore(), "users", follower), {
                            feed: arrayUnion(text)
                        })
                    })
                }

                batch.update(doc(getFirestore(), "users", uid), {
                    posts: arrayUnion(text)
                })


                batch.set(doc(getFirestore(), "posts", text), {
                    caption: caption,
                    postIMG: urlImage,
                    likes: [],
                    comments: [],
                    user: uid,
                    name: getAuth().currentUser.displayName,
                    profilePic: getAuth().currentUser.photoURL,
                    id: text,
                    timestamp: Date.now()
                })

                batch.commit();
            }

            batchData(url);
            
            alert("Your post has been posted!");
        })
        .catch((error) => {
          // Handle any errors
        });

    
       
    }

    const handleImageAsFile = (e) => {
        const image = e.target.files[0]
        console.log(image);
        setImageAsFile(imageFile => (image))
        
    }

    return ( 
        <>
            <div className="add flexbox column center">
                <div className="flexbox column center">
                    {option === 0 && 
                        <>
                            <button onClick = {()=>setOption(1)}>Follow New People</button>
                            <button onClick = {()=>setOption(2)}>Add A New Post</button>
                        </>
                    }{
                        option === 1 &&
                        <>
                            <h1>Search By Full Name</h1>
                            <input type="text" value = {name} onChange={(e)=>setName(e.target.value)}/>
                            <button onClick={handleFollow}>Search</button>
                        </>
                    }{
                        option === 2 &&
                        <>
                            <label>
                                <input type="file" onChange={handleImageAsFile}/>
                                {imageAsFile === '' && <h3>Add an Image</h3>}
                                <div>
                                    <FaCamera size = {75}/>
                                </div>
                                {imageAsFile  !== '' && <FaCheck style = {{color: 'green'}} size = {25}/>}
                            </label>
                            <br />
                            <input type="text" value = {caption} onChange={(e)=>setCaption(e.target.value)}/>
                            <button onClick={handlePost}>Post</button>
                        </>
                    }
                </div>

                {
                    option > 0 && <TiArrowBack size = {50} onClick = {()=>setOption(0)}/>
                }
            </div>

        </>
     );
}
 
export default Add;