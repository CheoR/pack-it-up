import React from "react"
import { SummaryList } from "../../summary/SummaryList"
import "./userPage.css"

export const UserPage = () => {
 const loggedInUserId = parseInt(sessionStorage.getItem("app_user_id"))

 return (
  <main className="userPage">
   <h1 className="userPage__header">PackItUp</h1>
   <SummaryList loggedInUserId={loggedInUserId} />
   <button className="userPage__btn--logout">Logout</button>
  </main>
 )
}
