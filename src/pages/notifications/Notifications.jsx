import './notifications.css';
import {VscRefresh} from 'react-icons/vsc';
import {FaCheck} from 'react-icons/fa';
import Loading from '../../components/loading/loading';
import { useEffect, useState } from 'react';
import { getFirestore, doc, arrayRemove, updateDoc, onSnapshot} from 'firebase/firestore';
import {getAuth} from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
const Notifications = () => {

    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uid, setUid] = useState('');
    let navigate = useNavigate();
    useEffect(() => {
        setLoading(true);

        const docRef = doc(getFirestore(), "users", getAuth().currentUser.uid);
        const snapshot = onSnapshot(docRef, (doc) => {
            setNotifications(doc.data().notifications);
            setUid(doc.data().uid);
        });

        setLoading(false);


        return () => {
            snapshot();
        }


    }, [])

    const Notif = ({notification}) => {

        const content = notification.split(';')[0];
        const id = notification.split(';')[1];

        const navLink = notification.includes('following') ? `../user/${id}` : `../post/${id}`;

        const handleDelete = async() => {
            setLoading(true);
            await updateDoc(doc(getFirestore(), "users", uid), {
                notifications: arrayRemove(`${notification}`)
            })
            setLoading(false);            
        }   
    
        return (
            <>
            {loading ? <Loading /> : 
                <>
                    <br/>
                    <div className="notif">
                        <h3 className = 'pointer' onClick={()=>navigate(navLink)}>{content}</h3>
                        <FaCheck onClick = {handleDelete} style = {{color: 'green', cursor: 'pointer'}} size={15}/>
                    </div>
                    <br/>
                </>
            }
            </>
        );
    }

    return ( 
        <>
            {loading ? <Loading /> :
            <div className="notifications flexbox column center">
                <br/>
                {
                    notifications.map((notification, index) => {
                        return (
                            <Notif key={index} notification={notification}/>
                        );
                    })
                   
                }
                {         
                    notifications.length === 0 && <><h1>No New Notifications</h1></>
                }
                <footer className="flexbox">
                    <VscRefresh size = {25} onClick = {()=>window.location.reload()}/>
                </footer>
            </div>  }      
        </>
     );
}
 
export default Notifications;