import { useState } from "react";
import { doc, getDoc, getFirestore } from "firebase/firestore"; 
import { useNavigate } from "react-router";
import Loading from "../../components/loading/loading";
import './search.css';
const Search = () => {

    const [loading, setLoading] = useState(false);
    const [name, setName] = useState('');
    const navigate = useNavigate();
    const handleSearch = async() => {
        setLoading(true);

        const docRef = doc(getFirestore(), "allUsers", name);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const followeeUid = docSnap.data().uid;
            navigate('/user/' + followeeUid);
            setName('')
            setLoading(false);
        }
        else {
            alert("That user does not exist, check your spelling maybe?");
            setLoading(false);
        }

    }
    return (  
        <>
        {loading ? <Loading /> :

            <div className="search flexbox column center">
                <h1>Search By Full Name</h1>
                <input type="text" placeholder = 'Ashwin Talwalkar' value = {name} onChange={(e)=>setName(e.target.value)}/>
                <button onClick={handleSearch}>Search</button>
            </div>}
        </>
    );
}
 
export default Search;