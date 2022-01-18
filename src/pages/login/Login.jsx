import './login.css';
import GoogleButton from 'react-google-button'
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";

const Login = () => {

    const provider = new GoogleAuthProvider();

    const auth = getAuth();

    const signIn = () => {
        signInWithPopup(auth, provider)
    }

    return (  
        <>
           <div className="flexbox column center loginContainer">
                <div className="flexbox column center">
                    <img src = './images/logo.png' alt = 'main logo' className="logo"/>
                    <GoogleButton onClick = {signIn}/> 
                    <br />      
                </div> 
                <footer>
                    <h5>&copy; 2022 - Ashwin N. Talwalkar</h5>
                </footer>
            </div> 
        </>
    );
}


 
export default Login;