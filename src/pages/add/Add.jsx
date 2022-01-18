import { useState } from "react";
import { writeBatch, doc, getDoc, getFirestore, arrayUnion} from "firebase/firestore"; 
import { getAuth } from "firebase/auth";
import { getStorage, ref, uploadBytesResumable  } from "firebase/storage";

import './add.css';
const Add = () => {

    const [option, setOption] = useState(0);
    const [name, setName] = useState('Enter A Name');
    const [postIMG, setPostIMG] = useState('');
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

        const storage = getStorage();
        const url = "users/" + uid + "/" + caption.substring(0,3) + ".png"
        const picRef = ref(storage, url); 

        await uploadBytesResumable(picRef, postIMG);

        const batch = writeBatch(getFirestore());

        const docRef = doc(getFirestore(), "users", getAuth().currentUser.uid);
        const docSnap = await getDoc(docRef);

        let text = "";
        const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      
        for (var i = 0; i < 15; i++)
          text += possible.charAt(Math.floor(Math.random() * possible.length));

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
            postIMG: url,
            likes: 0,
            comments: [],
            user: uid
        })

        batch.commit();
        alert("Your post has been posted!");
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
                            <input type="file" value = {postIMG} onChange={(e)=>setPostIMG(e.target.value)}/>
                            <h3>Caption</h3>
                            <input type="text" value = {caption} onChange={(e)=>setCaption(e.target.value)}/>
                            <button onClick={handlePost}>Post</button>
                        </>
                    }
                </div>
            </div>

        </>
     );
}
 
export default Add;