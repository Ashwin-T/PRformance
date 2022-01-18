import Notif from '../../components/notif/Notif';
import './notifications.css';
import {VscRefresh} from 'react-icons/vsc';
const Notifications = () => {

    const notifications = JSON.parse(localStorage.getItem('notifications'));

    return ( 
        <>
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
            </div>        
        </>
     );
}
 
export default Notifications;