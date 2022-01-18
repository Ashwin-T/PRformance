import './post.css';

const Post = ({post}) => {
    console.log(post);
    return (
        <div className="post flexbox column center">
            <div className="post-img flexbox">
                <img src={post.postIMG} alt=""/>
            </div>
            <div className="post-likes flexbox">
                <h3>{post.likes}</h3>
                <h3>{/*Enter Link Button*/}</h3>
            </div>
            <div className="post-caption flexbox">
                <h3>{post.caption}</h3>
            </div>
        </div>

      );
}
 
export default Post;