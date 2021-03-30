import React from 'react'
import { Link } from 'react-router-dom'
import { Instructions } from '../../helpers/instructions/Instructions'
import "./landingPage.css"


export const LandingPage = () => {

 return (
  <main className="landingPage">
   <section className="landingPage__banner">
    <figure>
      <figcaption>track what you pack, app</figcaption>
     <img src="https://images.unsplash.com/photo-1603861609805-29b5fda4a585?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=2140&q=80" alt="Labelled boxes" />
    </figure>
    <Instructions />
   </section>
   <Link to="/register">
      <button className="landingPage__btn--register">Register</button>
   </Link>
   <Link to="/login">
    <button className="landingPage__btn--login">Login</button>
   </Link>
  </main>
 )
}
