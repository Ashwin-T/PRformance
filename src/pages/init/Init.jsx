import './init.css';
import {useState, useEffect} from 'react';
import { arrayRemove, doc, getDoc, getFirestore, writeBatch} from "firebase/firestore"; 
import { getAuth } from 'firebase/auth';
import Loading from '../../components/loading/loading';
import { TiArrowBack } from 'react-icons/ti';
import { getStorage, ref, deleteObject } from "firebase/storage";
import { useNavigate } from 'react-router-dom';
const Init = () => {

    let navigate = useNavigate();

    const [option, setOption] = useState(0);
    const [page, setPage] = useState(1);
    const [virgin, setVirgin] = useState(true);
    const [shortTerm, setShortTerm] = useState('Drink Water');
    const [longTerm, setLongTerm] = useState('Weight Loss');
    const [bio, setBio] = useState('I am a new user');
    const [playList, setPlaylist] = useState('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const [posts, setPosts] = useState([]);
    const [user, setUser] = useState('');
    const [currentPost, setCurrentPost] = useState({});
    useEffect(() => {
        setLoading(true);
        const checkFirestore = async () => {
            const docRef = doc(getFirestore(), "users", getAuth().currentUser.uid);
            const docSnap = await getDoc(docRef);

            const getPosts = async(postz) => {
                await getDoc(doc(getFirestore(), "posts", postz)).then(docSnap => {
                    setPosts(posts => [docSnap.data(), ...posts]);
                })
            }
            if (docSnap.exists()) {
                setUser(docSnap.data());
                setShortTerm(docSnap.data().shortTerm);
                setLongTerm(docSnap.data().longTerm);
                setBio(docSnap.data().bio);
                setPlaylist(docSnap.data().playList);
                const posts = docSnap.data().posts;
                posts.forEach(post => {
                    getPosts(post);
                })
                setVirgin(false);
                setOption(0)
                setPage(1);
            } else {
            // doc.data() will be undefined in this case
                setOption(1)
                setPage(0);
            }
        }

        checkFirestore();
        setLoading(false);
    }, [])

    const submit = async () => {
        setLoading(true);
        const batch = writeBatch(getFirestore());
        if(virgin) {
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
                name: getAuth().currentUser.displayName
            });
            batch.set(doc(getFirestore(), "allUsers", getAuth().currentUser.displayName), {uid: getAuth().currentUser.uid});
        }
        else{
            batch.update(doc(getFirestore(), "users", getAuth().currentUser.uid), {
                shortTerm: shortTerm,
                longTerm: longTerm,
                bio: bio,
                playList: playList,
            });
        }
        
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
            name: getAuth().currentUser.displayName
        }



        localStorage.setItem('userData', userData);
        localStorage.setItem('profPic', getAuth().currentUser.photoURL);
        
        await batch.commit().then(()=>{
            window.location.reload();
            setVirgin(false);
        });
        
        setLoading(false);
    }


    const handleDelete = async () => {
        setLoading(true);

        const storage = getStorage();

        // Create a reference to the file to delete
        const imgRef = ref(storage, currentPost.imgName);

        // Delete the file
        deleteObject(imgRef).then(() => {
                const batch = writeBatch(getFirestore());

                user.followers.forEach(follower => {
                    batch.update(doc(getFirestore(), "users", follower), {
                        feed: arrayRemove(currentPost.id)
                    })
                })

            batch.update(doc(getFirestore(), "users", getAuth().currentUser.uid), {
                posts: arrayRemove(currentPost.id)
            })

            batch.delete(doc(getFirestore(), "posts", currentPost.id));

            batch.commit();
            setCurrentPost('');
            setOpen(false);
            setPosts(posts => [...posts.filter(post => post.id !== currentPost.id)]);
            alert('Post Deleted');
            setLoading(false);
        }).catch((error) => {
        // Uh-oh, an error occurred!
            setLoading(true)
        });
        
    }
    const Modal = () => {
        return (
            <div className="modal flexbox column center">
                <div className="modal-content flexbox column center">
                    <div className="flexbox center pointer" onClick={()=>navigate(`/post/${currentPost.id}`)}>
                        <h3>View Comments</h3>
                    </div>
                    <div className="flexbox center pointer" onClick={handleDelete}>
                        <h3>Delete Post</h3>
                    </div>
                   
                    <TiArrowBack size = {50} style = {{color: 'black'}} onClick={()=> setOpen(false)}/>

                </div>
            </div>
        )
    }

    return ( 
        <>
            {loading ? <Loading /> :
            <div className="init flexbox column center">
                    {
                        option === 0 ?
                            <>
                                <button onClick = {()=>setOption(1)}>Edit Profile</button>
                                <br />
                                <button onClick = {()=>setOption(2)}>View Posts</button>
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
                            <br/> 
                            {!virgin && <TiArrowBack size = {50} onClick = {()=>setOption(0)}/>}    
                        </> : 
                        <>
                        <h1>You Are Ready to Go!</h1>
                            <button onClick = {submit}>Let's Go</button>
                        </>
                        : option === 2 ? 
                        <>
                            {posts.length > 0 ?
                            <>
                                {open && <Modal />}
                                <h1>View Posts</h1>
                                <div className="allPosts">
                                    {posts.map((post, index) => {
                                        return (
                                            <div onClick = {()=> {setOpen(true); setCurrentPost(post)}} key = {index} className="posts flexbox column center pointer">
                                                <img src={post.postIMG} alt="post" />
                                            </div>
                                        )
                                    })}
                                </div>
                            </>  : 
                                <div className="flexbox column center">
                                    <h1>You Have No Posts!</h1>
                                </div>  
                            }
                            <TiArrowBack size = {50} onClick = {()=>setOption(0)}/>

                            
                        </> : null
                    }
            </div>   }
        </>
    );
}
 
export default Init; 