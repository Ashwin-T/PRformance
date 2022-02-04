import {Link} from 'react-router-dom';
import './navbar.css';
import {FaHome, FaBell, FaRegPlusSquare, FaExclamation, FaSearch} from 'react-icons/fa';
import { useEffect, useState } from 'react';

import { onSnapshot, doc, getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
const Navbar = () => {
    
    const [notif , setNotif] = useState([]);

    useEffect(() => {
        const docRef = doc(getFirestore(), "users", getAuth().currentUser.uid);
        const snapshot = onSnapshot(docRef, (doc) => {
            setNotif(doc.data().notifications);
        });

        return () => {
            snapshot();
        }
    }, [])


    return ( 
        <>
            <nav>
                <h1>PRformance</h1>
                <div className='icons'>
                    <Link to="/"><FaHome size = {25}/></Link>
                    <Link to='/search'><FaSearch size={25}/></Link>
                    <Link to='/notifications'><span><FaBell size={25}/>{notif.length > 0 && <FaExclamation style = {{color: 'red'}} />}</span></Link>
                    <Link to = '/add'><FaRegPlusSquare size = {25}/></Link>
                    <Link to = '/profile'><img src = {getAuth().currentUser.photoURL} alt = 'profile'/></Link>
                </div>
                
            </nav>
        </>
     );
}
 
export default Navbar;