import {Link} from 'react-router-dom';
import './navbar.css';
import {FaHome, FaBell, FaRegPlusSquare, FaExclamation, FaChartLine} from 'react-icons/fa';

const Navbar = () => {

    const Bell = () => {

        if(localStorage.getItem('notifications').length > 2) { //LOL THIS IS A STRING SO I CANT USE LENGTH IG
            return (
                <span className="bell">
                    <FaBell size={25}/>
                    <FaExclamation style = {{color: 'red'}} />
                </span>
            );
        }
        else{
            return (
                <span className="bell">
                    <FaBell size={25}/>
                </span>
            );
        }
    }

    return ( 
        <>
            <nav>
                <h1>PRformance</h1>
                <div className='icons'>
                    <Link to="/"><FaHome size = {25}/></Link>
                    <Link to='/notifications'><Bell /></Link>
                    <Link to = '/add'><FaRegPlusSquare size = {25}/></Link>
                    <Link to = '/progress'><FaChartLine size = {25} /></Link>
                    <Link to = '/profile'><img src = {localStorage.getItem('profPic')} alt = 'profile'/></Link>
                </div>
                
            </nav>
        </>
     );
}
 
export default Navbar;