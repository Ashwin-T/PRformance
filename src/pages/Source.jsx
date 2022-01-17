import React from 'react'
import { Route, Routes } from "react-router-dom";


const Source = () => {

    const Feed = () => {
        return (
            <div>
                <h1>Feed</h1>
            </div>
        )
    }
    return ( 
        <>
            <Routes>
                <Route exact path="/" element={<Feed />}/>
            </Routes>   
        </>
     );
}
 
export default Source; 