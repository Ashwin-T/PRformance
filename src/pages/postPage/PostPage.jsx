import { useParams, useNavigate} from "react-router-dom";
import { useEffect, useState } from "react";
import {doc, getDoc, getFirestore, arrayUnion, writeBatch } from "firebase/firestore";
import Loading from "../../components/loading/loading";
import { getAuth } from "firebase/auth";
import './postPage.css';
const PostPage = () => {
    const {id} = useParams();

    const [post, setPost] = useState({comments: []});
    const [loading, setLoading] = useState(true);
    const [newComment, setNewComment] = useState('');

    let navigate = useNavigate();

    useEffect(() => {
        setLoading(true);
        const getPostData = async() => {
            const docRef = doc(getFirestore(), "posts", id);
            const docSnap = await getDoc(docRef)

            if(docSnap.exists()){
                const data = docSnap.data();
                setPost(data);
            }
            else{
                navigate('/');
            }

            setLoading(false);
        }
        getPostData()
        setLoading(false);

        return () => {
            
        }
    }, [id, navigate])

    const addComment = async() => {
        const user = getAuth().currentUser;
        const batch = writeBatch(getFirestore());
        
        if(newComment !== ''){
            const pushComment =user.photoURL + ';' + user.displayName + ';' + newComment;
            batch.update(doc(getFirestore(), "users", post.user), {
                notifications: arrayUnion(`${user.displayName} commented on your post;${post.id}`)
            })

            batch.update(doc(getFirestore(), "posts", id), {comments: arrayUnion(pushComment)})

            await batch.commit().then(()=>{
                setPost({...post, comments: [...post.comments, pushComment]})
                setNewComment('');
            });
        }
    }
         

    return ( 
        <>
            {loading ? <Loading /> : 
                <>
                    <div className="flexbox column center postPage">
                        <div className="flexbox column center">
                            <div className="comments flexbox column center">
                                <br/>
                                <br/>
                                <br/>
                                {
                                    post.comments.length > 0 ?
                                    
                                    post.comments.map((comment, index) => {
                                        return(
                                            <div key = {index} className="flexbox column center comment">
                                                <br/>
                                                <h3>{comment.split(';')[2]}</h3>
                                                <div className = 'flexbox center'>
                                                    <img className="comment-img" src={comment.split(';')[0]} alt="icon"/>
                                                    <h4>{comment.split(';')[1].split(' ')[0]}</h4>
                                                </div>
                                            </div>
                                        )
                                    })
                                    :
                                    <h3>No Comments Yet</h3>
                                }
                                <br/>
                                <br/>
                                <br/>
                            </div>
                        </div>
                    </div>
                    <br/>
                    <div className="flexbox center addComment">
                        <input type="text" placeholder="Add a new comment..." value={newComment} onChange={(e) => setNewComment(e.target.value)}/>
                        <button onClick={addComment}>Add</button>
                    </div>
                </>
            }

        </>
     );
}
 
export default PostPage;