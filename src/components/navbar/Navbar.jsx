import { Link, Redirect, useHistory } from "react-router-dom"
import React, { useEffect, useState } from "react"

import { userStorageKey } from "../auth/authSettings"
import "./navbar.css"

export const Navbar = () => {

 let loggedInUserId;
 const [isLoggedIn, setIsLoggedIn ] = useState(false)

 const history = useHistory()

 useEffect(() => {
   loggedInUserId = parseInt(sessionStorage.getItem(userStorageKey)) 
   if(loggedInUserId) {
     setIsLoggedIn(true)
   } else {
     setIsLoggedIn(false)
   }
  
 }, [isLoggedIn]) // useEffect
 
 /*
  TODO: FIX LOG IN WHERE LOGOUT/SETTINGS BUTTONS SHOW UP AFTER SUCCESSFU LOG IN.
 */

 const handleLogout = () => {
  console.log("logging out")
  sessionStorage.removeItem("app_user_id")
  setIsLoggedIn(false)
  /*
   Page redirects but since there is no hard reload,
   logout button will still show up
  */
  history.push("/")
  // {
  //  <Redirect to="/" push={true}/>
  // }
 }

 return (
  <nav className="navbar">
   <ul className="navbar__ul">
    <li className="navbar__li">
     <Link className="navbar__link" to="/users">Home</Link>
    </li>
    <li className="navbar__li">
     <Link className="navbar__link" to="/moves">Moves</Link>
    </li>
    <li className="navbar__li">
     <Link className="navbar__link" to="/boxes">Boxes</Link>
    </li>
    <li className="navbar__li">
     <Link className="navbar__link" to="/items">Items</Link>
    </li>
    {
     isLoggedIn
     ?
     <>
      <li className="navbar__li">
       <Link className="navbar__link" to="/Settings">Settings</Link>
      </li>
       <li className="navbar__li">
        <button className="navbar__link" onClick={handleLogout}>Logout</button>
       </li>
     </>
     :
      <></>
    }
   </ul>
  </nav>
 )
}
