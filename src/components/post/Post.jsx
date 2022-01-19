import './post.css';
import {BsThreeDots} from 'react-icons/bs';
import {GiHeartBeats} from 'react-icons/gi';
import {useEffect, useState} from 'react'
import { doc, updateDoc, getFirestore , arrayUnion, arrayRemove } from "firebase/firestore";
import { getAuth } from "firebase/auth";
const Post = ({post}) => {
    const [likes, setLikes] = useState(post.likes.length);
    const [liked, setLiked] = useState(false);
    const [heartStyle, setHeartStyle] = useState('')

    useEffect(() => {
        if (post.likes.includes(getAuth().currentUser.uid)) {
            setLiked(true);
            setHeartStyle('red');
        }
    }, [post.likes])

    const handleLike = async() => {

        setLiked(!liked);
        if(!liked){
            setHeartStyle('red')
            setLikes(likes + 1);
            await updateDoc(doc(getFirestore(), "posts", post.id), {likes: arrayUnion(getAuth().currentUser.uid)})
        }
        else{
            setHeartStyle('')
            setLikes(likes - 1);
            await updateDoc(doc(getFirestore(), "posts", post.id), {likes: arrayRemove(getAuth().currentUser.uid)});
        }        

    }
    return (
        <>
            <br/>
            <div className="post flexbox column center">
                <div className="topbar flexbox" style = {{alignItems: 'center', justifyContent: 'space-between'}}>
                    <div className = 'left flexbox center'>
                        <img src={post.profilePic} alt="profpic"/>
                        <h4>{post.name}</h4>
                    </div>
                    
                    <BsThreeDots className = 'dots' size = {25}/>
                </div>
                <div className="post-img flexbox">
                    <img src={post.postIMG} alt="postImage"/>
                </div>
                <div className="buttombar flexbox column">
                    <div className = "flexbox" style = {{alignItems: 'center', justifyContent: 'space-between'}}>
                        <div className = 'flexbox center'>
                            <GiHeartBeats onClick = {handleLike} className = {'heart ' + heartStyle} size = {25}/>
                            <h2>{likes}</h2>
                        </div>
                    </div>
                    <div className = "flexbox caption" style = {{alignItems: 'center'}}>
                        <h4>{post.name}</h4>
                        <p>{post.caption}</p>
                    </div>
                </div>
            </div>
            <br/>
        </>

      );
}
 
export default Post;