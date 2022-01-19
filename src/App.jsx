import React from 'react';
import Login from './pages/login/Login';
import Source from './pages/Source';
import { useAuthState } from 'react-firebase-hooks/auth';
import { getAuth } from 'firebase/auth';
import {app} from './tools/Firebase';
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import Loading from './components/loading/loading';
const App = () =>{

  const auth = getAuth(app);
  const [user, loading] = useAuthState(auth);

  return (
    <div className="App">
        {
          loading ? <Loading /> : user ? <Source />: <Login />
        }
    </div>
  );
}

export default App;
