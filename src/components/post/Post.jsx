import './post.css';
import {BsThreeDots} from 'react-icons/bs';
import {GiHeartBeats} from 'react-icons/gi';
import {TiArrowBack} from 'react-icons/ti';
import {useEffect, useState} from 'react'
import { doc, updateDoc, getFirestore , arrayUnion, arrayRemove } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { useNavigate } from 'react-router-dom';
const Post = ({post}) => {
    const [likes, setLikes] = useState(post.likes.length);
    const [liked, setLiked] = useState(false);
    const [heartStyle, setHeartStyle] = useState('')
    const [showModal, setShowModal] = useState(false);
    const [postStyle, setPostStyle] = useState('');

    let navigate = useNavigate();
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

    const handleOpenModal = () => {
        setShowModal(true);
        setPostStyle('modalOpen');
    }

    const handleCloseModal = () => {
        setShowModal(false);
        setPostStyle('');
    }

    const Modal = () => {
        return (
            <div className="modal flexbox column center">
                    <h3 onClick={()=>navigate(`/user/${post.user}`)}>View User Profile</h3>
                    <h3>View and Add Comment</h3>
                    <TiArrowBack size = {50} style = {{color: 'black'}} onClick={handleCloseModal}/>
            </div>
        )
    }
    return (
        <>
            {showModal && <Modal />}
            <div className={"post flexbox column center " + postStyle}>
                <div className="topbar flexbox" style = {{alignItems: 'center', justifyContent: 'space-between'}}>
                    <div className = 'left flexbox center'>
                        <img src={post.profilePic} alt="profpic"/>
                        <h4>{post.name}</h4>
                    </div>
                    
                    <BsThreeDots className = 'dots' size = {25} onClick = {handleOpenModal}/>
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