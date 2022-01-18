import './notif.css';
import {FaCheck} from 'react-icons/fa';
import { doc, updateDoc, arrayRemove, getFirestore } from "firebase/firestore";

const Notif = ({notification}) => {

    const handleDelete = async() => {
        const ref = doc(getFirestore(), "users", localStorage.getItem('uid'));
    
        await updateDoc(ref, {
            notifications: arrayRemove(`${notification}`)
        });

        localStorage.setItem('notifications', JSON.stringify(JSON.parse(localStorage.getItem('notifications')).filter(notif => notif !== notification)));

        window.location.reload();
    }   

    return (
        <>
        <br/>
        <div className="notif">
            <h3>{notification}</h3>
            <FaCheck onClick = {handleDelete} style = {{color: 'green'}} size={15}/>
        </div>
        <br/>
        </>
    );
}
 
export default Notif;