import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc, getFirestore , writeBatch, arrayRemove, arrayUnion} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import Loading from '../../components/loading/loading';
import {AiOutlineUser} from 'react-icons/ai';
import './user.css';

const User = () => {
    const {id} = useParams();
    const [user, setUser] = useState('');
    const [loading, setLoading] = useState(true);
    const [follows, setFollows] = useState(false);
    const [posts, setPosts] = useState([]);
    const [followStyle, setFollowStyle] = useState('follow');

    useEffect(() => {
        setLoading(true);
        const getUserData = async() => {
            const docRef = doc(getFirestore(), "users", id);
            const docSnap = await getDoc(docRef)

            if(docSnap.exists()){
                const data = docSnap.data();
                setUser(data);
                setFollows(docSnap.data().followers.includes(getAuth().currentUser.uid));
            }
            else{
                console.log("User does not exist");
            }

            const getPosts = async(postz) => {
                await getDoc(doc(getFirestore(), "posts", postz)).then(docSnap => {
                    setPosts(posts => [docSnap.data(), ...posts]);
                })
                setLoading(false);
            }

            if(follows){
                //get the posts of the user
                setFollowStyle('follow')
                const posts = docSnap.data().posts;
                posts.forEach(post => {
                    getPosts(post);
                })
            }
            else{
                setFollowStyle('unfollow')
            }
        }
        getUserData()
        setLoading(false);
    }, [follows, id]) 

    const followOrUnfollow = async() => {
        const batch = writeBatch(getFirestore());

        const followerDoc = doc(getFirestore(), "users", getAuth().currentUser.uid);
        const followeeDoc = doc(getFirestore(), "users", id);

        if(follows){
            batch.update(followerDoc, {
                following: arrayRemove(getAuth().currentUser.uid)
            })
            batch.update(followeeDoc, {
                followers: arrayRemove(getAuth().currentUser.uid),
                notifications: arrayRemove(getAuth().currentUser.displayName + " has started following you")
            })
            batch.commit();
            setFollows(false);
        }
        else{
            batch.update(followerDoc, {
                following: arrayUnion(getAuth().currentUser.uid)
            })
            batch.update(followeeDoc, {
                followers: arrayUnion(getAuth().currentUser.uid),
                notifications: arrayUnion(getAuth().currentUser.displayName + " has started following you")
            })
            batch.commit();
            setFollows(true);
        }

    }
    return ( 
        <>
            {loading  && user !== null ? <Loading /> : 
                <div className="user-profile flexbox column center">
                    <br/>
                    <div className="flexbox center name-photo">
                        <img src={user.photoURL} alt="profile" className="profile-pic" />
                        <h1>{user.name}</h1>
                    </div>
                    <br/>
                    <div className="bio">
                        <h3>{user.bio}</h3>
                        <h5>Short Term Goal: {user.shortTerm}</h5>
                        <h5>Long Term Goal: {user.longTerm}</h5>
                    </div>
                    <br/>
                        <button className={followStyle} onClick = {followOrUnfollow}><AiOutlineUser /> {follows ? `Unfollow` : `Follow`}</button>
                    <br/>
                    <div className="allPosts">
                        {follows && posts.map((post, index) => {
                            return (
                                <div key = {index} className="posts flexbox column center">
                                    <img src={post.postIMG} alt="post" />
                                </div>
                            )
                        })}
                    </div>
                </div>
            }

        </> 
    );
}
 
export default User;