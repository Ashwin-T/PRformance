import React from 'react'
import { Route, Routes } from "react-router-dom";
import { useEffect, Suspense } from 'react';

import { doc, getDoc, onSnapshot, getFirestore} from "firebase/firestore";
import { getAuth } from 'firebase/auth';

import Navbar from '../components/navbar/Navbar';
import Init from './init/Init';
import Notifications from './notifications/Notifications';
import Add from './add/Add';
import Feed from './feed/Feed';


const Source = () => {

    const [init, setInit] = React.useState(false);

    
    useEffect(() => {

        const db = getFirestore();

        const getData = async () => {
            const docRef = doc(db, "users", getAuth().currentUser.uid);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                localStorage.setItem('shortTerm', docSnap.data().shortTerm);
                localStorage.setItem('longTerm', docSnap.data().longTerm);
                localStorage.setItem('bio', docSnap.data().bio);
                localStorage.setItem('playList', docSnap.data().playList);
                localStorage.setItem('follows', JSON.stringify(docSnap.data().follows));
                localStorage.setItem('followers', JSON.stringify(docSnap.data().followers));
                localStorage.setItem('posts', JSON.stringify(docSnap.data().posts));
                localStorage.setItem('notifications', JSON.stringify(docSnap.data().notifications));
                localStorage.setItem('profPic', getAuth().currentUser.photoURL);
                localStorage.setItem('uid', getAuth().currentUser.uid);
                setInit(false);
            } else {
            // doc.data() will be undefined in this case
                console.log("No such document!");
                setInit(true);
            }
        }  

        getData();  

    }, [])


    useEffect(() => {

        const listenForUpdates = async () => {
            onSnapshot(doc(getFirestore(), "users", getAuth().currentUser.uid), (docSnap) => {
                localStorage.setItem('shortTerm', docSnap.data().shortTerm);
                localStorage.setItem('longTerm', docSnap.data().longTerm);
                localStorage.setItem('bio', docSnap.data().bio);
                localStorage.setItem('playList', docSnap.data().playList);
                localStorage.setItem('follows', JSON.stringify(docSnap.data().follows));
                localStorage.setItem('followers', JSON.stringify(docSnap.data().followers));
                localStorage.setItem('posts', JSON.stringify(docSnap.data().posts));
                localStorage.setItem('notifications', JSON.stringify(docSnap.data().notifications));
                localStorage.setItem('profPic', getAuth().currentUser.photoURL);
                localStorage.setItem('uid', getAuth().currentUser.uid);
                console.log('updated');
            });
        }

        listenForUpdates();
    } , [init])

    return ( 
        <>
            {
                init === false ?
                
                <Suspense>
                    <Routes>
                        <Route exact path="/" element={<><Navbar /><Feed /></>}/>
                        <Route exact path="/notifications" element={<><Navbar /><Notifications /></>}/>
                        <Route exact path="/add" element={<><Navbar /><Add /></>}/>
                        <Route exact path="/progress" element={<><Navbar /></>}/>
                        <Route exact path="/profile" element={<><Navbar /><Init /></>}/>
                        <Route exact path="/init" element={<Init />}/>
                    </Routes>   
                </Suspense> :  <Init />
            }
            {
                init === 'notReady' && <div>Loading...</div>
            }
        </>
        
     );
}
 
export default Source; 