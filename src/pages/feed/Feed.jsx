import './feed.css';
import Post from '../../components/post/Post';
import { useEffect, useState } from 'react';
import { doc, getFirestore, onSnapshot } from "firebase/firestore";


const Feed = () => {


    const [posts, setPosts] = useState([]);
    const [feed, setFeed] = useState([]);

    useEffect(() => {
        onSnapshot(doc(getFirestore(), "users", localStorage.getItem('uid')), (doc) => {
            setFeed(doc.data().feed);
        });

        feed.forEach(post => {
            onSnapshot(doc(getFirestore(), "posts", post), (doc) => {
                setPosts(posts => [...posts, doc.data()]);
            });
        })
        
    }, [])
    return ( 
        <>
            <div className="feed flexbox column center">
                {
                    posts.map((post, index) => {
                        return (
                            <Post key={index} post={post}/>
                        );
                    })
                }
                {
                    posts.length === 0 && <><h1>No Posts Yet</h1></>
                }
            </div>
        </>
     );
}
 
export default Feed;