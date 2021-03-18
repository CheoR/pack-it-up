import React from "react"

export const UserPage = () => {
 const loggedInUserId = parseInt(sessionStorage.getItem("app_user_id"))
 return (
  <main className="userPage">
   <header className="userPage__header">PackItUp: { loggedInUserId }</header>
   <section className="userPage__summary"></section>
   <button className="userPage__btn--logout">Logout</button>
  </main>
 )
}
