import './init.css';
import {useState, useEffect} from 'react';
import { doc, getDoc, getFirestore, writeBatch} from "firebase/firestore"; 
import { getAuth } from 'firebase/auth';

// Get a new write batch
const Init = () => {

    const [option, setOption] = useState(0);
    const [page, setPage] = useState(1);

    const [shortTerm, setShortTerm] = useState('Drink Water');
    const [longTerm, setLongTerm] = useState('Weight Loss');
    const [bio, setBio] = useState('I am a new user');
    const [playList, setPlaylist] = useState('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
    
    useEffect(() => {

        const checkFirestore = async () => {
            const docRef = doc(getFirestore(), "users", getAuth().currentUser.uid);
            const docSnap = await getDoc(docRef);
    
            if (docSnap.exists()) {
                setShortTerm(docSnap.data().shortTerm);
                setLongTerm(docSnap.data().longTerm);
                setBio(docSnap.data().bio);
                setPlaylist(docSnap.data().playList);
                setOption(0)
                setPage(1);
            } else {
            // doc.data() will be undefined in this case
                console.log("No such document!");
                setOption(1)
                setPage(0);
            }
        }

        checkFirestore();
    }, [])

    const submit = async () => {
        const batch = writeBatch(getFirestore());

        batch.set(doc(getFirestore(), "users", getAuth().currentUser.uid), {
            shortTerm: shortTerm,
            longTerm: longTerm,
            bio: bio,
            playList: playList,
            follows: [],
            followers: [],
            posts: [],
            notifications: [],
            feed: [],
            photoURL: getAuth().currentUser.photoURL,
            uid: getAuth().currentUser.uid,
        });

        const userData = {
            shortTerm: shortTerm,
            longTerm: longTerm,
            bio: bio,
            playList: playList,
            follows: [],
            followers: [],
            posts: [],
            notifications: [],
            feed: [],
            photoURL: getAuth().currentUser.photoURL,
            uid: getAuth().currentUser.uid,
        }

        batch.set(doc(getFirestore(), "allUsers", getAuth().currentUser.displayName), {uid: getAuth().currentUser.uid});

        await batch.commit();

        localStorage.setItem('userData', userData);
        localStorage.setItem('profPic', getAuth().currentUser.photoURL);

        window.location.href = '/'; 
    }
    return ( 
    
        <div className="init flexbox column center">
                {
                    option === 0 ?
                        <>
                            <button onClick = {()=>setOption(1)}>Edit Profile</button>
                            <br />
                            <button onClick = {()=>setOption(2)}>Edit Followers</button>
                            <br />
                            <button onClick = {()=>setOption(3)}>Edit Who Follows You</button>
                            <br />
                            <button onClick = {()=>setOption(4)}>Delete Posts</button>
                         </>
                    : option === 1 ?
                    page === 0 ? 
                    <>
                        <h1>Welcome to PRformance</h1>
                        <h2>Lets get you set up!</h2>
                        <button onClick = {()=>setPage(1)}>Get Started!</button>
                    </>

                    : page === 1 ? 
                    <>
                        <h3>What Long Term Goals Do You Have?</h3>
                        <input required type="text" value = {longTerm} onChange={(e)=>setLongTerm(e.target.value)} />
                        <h3>What Short Term Goals Do You Have?</h3>
                        <input type="text" value = {shortTerm} onChange = {(e) => setShortTerm(e.target.value)} />

                        <h3>Tell Us a Little About Yourself</h3>  
                        <input required type="text" value = {bio} onChange = {(e)=> setBio(e.target.value)}/>
                        <h3>Go To Workout Playlist?</h3>
                        <input required type="text" value = {playList} onChange = {(e)=> setPlaylist(e.target.value)} />
                        <br/>
                        <button onClick = {()=>setPage(2)}>Next</button>             
                    </> : 
                    <>
                       <h1>You Are Ready to Go!</h1>
                        <button onClick = {submit}>Let's Go</button>
                    </>
                    : null
                }
        </div>    
    );
}
 
export default Init; 