import { useState } from "react";
import { writeBatch, doc, getDoc, getFirestore, arrayUnion} from "firebase/firestore"; 
import { getAuth } from "firebase/auth";
import { getStorage, ref, uploadBytesResumable, getDownloadURL} from "firebase/storage";
import {FaCamera, FaCheck} from 'react-icons/fa';
import {TiArrowBack} from 'react-icons/ti';
import './add.css';
import Loading from "../../components/loading/loading";
const Add = () => {

    const [option, setOption] = useState(0);
    const [name, setName] = useState('');
    const [imageAsFile, setImageAsFile] = useState('')

    const [caption, setCaption] = useState('');
    const [loading, setLoading] = useState(false);

    const handleFollow = async() => {
        setLoading(true);

        const docRef = doc(getFirestore(), "allUsers", name);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const followeeUid = docSnap.data().uid;
            const followerUid = getAuth().currentUser.uid;
            const batch = writeBatch(getFirestore());
            
            batch.update(doc(getFirestore(), "users", followeeUid), {
                followers: arrayUnion(followerUid),
                notifications: arrayUnion(getAuth().currentUser.displayName + " has started following you;" + followerUid)
            })
            batch.update(doc(getFirestore(), "users", followerUid), {
                follows: arrayUnion(followeeUid)
            })

            batch.commit();
            setName('')
            alert("You are now following " + name);

        }
        else {
            alert("That user does not exist, check your spelling maybe?");
        }

        setLoading(false);
    }
    const handlePost = async() => {

        setLoading(true);
        
        const uid = getAuth().currentUser.uid;
        let text = "";
        const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      
        for (let i = 0; i < 15; i++)
          text += possible.charAt(Math.floor(Math.random() * possible.length));

        const storage = getStorage();
        const picStorageRef = ref(storage, imageAsFile.name); 

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
                    imgName: imageAsFile.name,
                    timestamp: Date.now()
                })

                batch.commit();
            }

            batchData(url);
            setCaption('Enter A Caption');
            setImageAsFile('');
            alert("Your post has been posted!");
        })
        .catch((error) => {
          // Handle any errors
          setLoading(true);
        });

        setLoading(false);
       
    }

    const handleImageAsFile = (e) => {
        const image = e.target.files[0]
        setImageAsFile(imageFile => (image))
    }

    return ( 
        <>
            {loading ? <Loading /> :
            <div className="add flexbox column center">
                    {option === 0 && 
                        <>
                            <button onClick = {()=>setOption(1)}>Follow New People</button>
                            <button onClick = {()=>setOption(2)}>Add A New Post</button>
                        </>
                    }{
                        option === 1 &&
                        <>
                            <h1>Search By Full Name</h1>
                            <input type="text" placeholder = 'Ashwin Talwalkar' value = {name} onChange={(e)=>setName(e.target.value)}/>
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
                            <input type="text" placeholder="Enter a Caption" onChange={(e)=>setCaption(e.target.value)}/>
                            <button onClick={handlePost}>Post</button>
                        </>
                    }

                {
                    option > 0 && <TiArrowBack size = {50} onClick = {()=>setOption(0)}/>
                }
            </div>
            }   
        </>
     );
}
 
export default Add;