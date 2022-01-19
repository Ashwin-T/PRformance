import './feed.css';
import Post from '../../components/post/Post';
import { useEffect, useState } from 'react';
import { doc, getFirestore, getDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import {VscRefresh} from 'react-icons/vsc';
import Loading from '../../components/loading/loading';

const Feed = () => {

    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        setLoading(true);

        const getFeed = async () => {
            const docRef = doc(getFirestore(), "users", getAuth().currentUser.uid);
            const docSnap = await getDoc(docRef);

            const getPosts = async(postz) => {
                const postRef = doc(getFirestore(), "posts", postz);
                const postSnap = await getDoc(postRef);
                if (postSnap.exists()) {
                    setPosts(posts => [postSnap.data(), ...posts]);
                }   
            }

            if (docSnap.exists()) {
                const feedData = docSnap.data().feed;
                feedData.forEach(post => {
                    getPosts(post)
                })
            } 
            else {
                console.log("No such document!");
            }
        }

        getFeed();

        setLoading(false);
             
    }, [])
    return ( 
        <>
            {
            loading ? <Loading /> :
            
            <div className="feed flexbox column center">
                <div className="posts scrollbar-hidden flexbox column center">
                    <br/>
                    {
                        posts.map((post, index) => {
                            return (
                                <Post key={index} post={post}/>
                            );
                        })
                    }
                    {
                        posts.length === 0 && <h1>No Posts Yet</h1>
                    }
                    <footer className="flexbox">
                        <VscRefresh size = {25} onClick = {()=>window.location.reload()}/>
                    </footer>
                </div> 
                
            </div>
            }
        </>
     );
}
 
export default Feed;