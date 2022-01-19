import { TailSpin } from  'react-loader-spinner'
import './loading.css';
const Loading = () => {
    return ( 
        <>
            <div className="loading flexbox column center">
                <TailSpin heigth="100" width="100" color='white'/>
            </div>
        </>
     );
}
 
export default Loading;