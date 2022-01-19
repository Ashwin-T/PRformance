import './notifications.css';
import {VscRefresh} from 'react-icons/vsc';
import {FaCheck} from 'react-icons/fa';
import Loading from '../../components/loading/loading';
import { useEffect, useState } from 'react';
import { getFirestore, doc, arrayRemove, updateDoc, onSnapshot} from 'firebase/firestore';
import {getAuth} from 'firebase/auth';
const Notifications = () => {

    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        setLoading(true);

        const docRef = doc(getFirestore(), "users", getAuth().currentUser.uid);
        const snapshot = onSnapshot(docRef, (doc) => {
            setNotifications(doc.data().notifications);
        });

        setLoading(false);


        return () => {
            snapshot();
        }


    }, [])

    const Notif = ({notification}) => {
    
        const handleDelete = async() => {
            setLoading(true);

            const ref = doc(getFirestore(), "users", localStorage.getItem('uid'));
        
            await updateDoc(ref, {
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
                        <h3>{notification}</h3>
                        <FaCheck onClick = {handleDelete} style = {{color: 'green'}} size={15}/>
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