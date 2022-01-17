import React from 'react';
import Login from './pages/login/Login';
import Source from './pages/Source';
import { useAuthState } from 'react-firebase-hooks/auth';
import { getAuth } from 'firebase/auth';
import {app} from './tools/Firebase';

const App = () =>{

  const auth = getAuth(app);
  const [user, loading, error] = useAuthState(auth);

  return (
    <div className="App">
        {
          loading ? <div>Loading...</div> : user ? <Source />: <Login />
        }
    </div>
  );
}

export default App;
