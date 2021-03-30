import React from "react"
import { SuperProvider } from "../../helpers/SuperProvider"
import { SummaryList } from "../../summary/SummaryList"
import "./userPage.css"

export const UserPage = () => {

 return (
  <main className="userPage">
   <h1 className="userPage__header">PackItUp</h1>
   <SummaryList />
   <SuperProvider />
  </main>
 )
}
