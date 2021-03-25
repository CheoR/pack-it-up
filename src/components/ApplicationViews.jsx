
import React from "react"
import { Route } from "react-router-dom"
import { UserPage } from "./routes/userPages/UserPage"
import { ItemProvider } from "./items/ItemProvider"
import { ItemList } from "./items/ItemList"
import { ItemDetail } from "./items/ItemDetail"
import { BoxProvider } from "./boxes/BoxProvider"
import { BoxList } from "./boxes/BoxList"
import { BoxDetail } from "./boxes/BoxDetail"
import { MoveProvider } from "./moves/MoveProvider"
import { MoveList } from "./moves/MoveList"
import { MoveDetail } from "./moves/MoveDetail"
import { UserProvider } from "./users/UserProvider"


// import { Home } from "./Home"

export const ApplicationViews = () => {
 return (
  <>
  <UserProvider><MoveProvider><BoxProvider><ItemProvider>
    <Route exact path="/users">
        <UserPage />
    </Route>


    <Route exact path="/items">
        <ItemList />
    </Route>

    <Route exact path="/items/:itemId(\d+)">
        <ItemDetail />
    </Route>


    <Route exact path="/boxes">
        <BoxList />
    </Route>

    <Route exact path="/boxes/:boxId(\d+)">
        <BoxDetail />
    </Route>


    <Route exact path="/moves">
        <MoveList />
    </Route>


    <Route exact path="/moves/:moveId(\d+)">
        <MoveDetail />
    </Route>

    {/* <Route path="/lists/:listType(\w+)/:userId(\d+)">
        <ItemList />
    </Route> */}
  
  </ItemProvider></BoxProvider></MoveProvider></UserProvider>
   {/* Render the animal list when http://localhost:3000/locations */}
   {/* <LocationProvider> */}
    {/* <Route exact path="/locations"> */}

   {/* Render the location list when http://localhost:3000/ */}
    {/* </Route> */}
   {/* <Route exact path="/"> */}
    {/* <Home /> */}
     {/* <LocationList />
   </Route>

    <Route exact path="/locations/create">
      <LocationForm />
    </Route>

    <Route exact path="/locations/detail/:locationId(\d+)">
      <LocationDetail />
    </Route>
   </LocationProvider> */}


   {/* Render the animal list when http://localhost:3000/animals */}
   {/* Need to wrap Animal.Provider */}
   {/*
    Note that the <AnimalList> component is a child of the <AnimalProvider> component.
    It is crucial that you wrap components that need data with the provider component 
    that exposes that data in JSX. You can wrap a component in as many providers as needed.
   */}
   {/* Allow acesss to multiple data providers */}
     {/* <AnimalProvider><LocationProvider><CustomerProvider>
    <Route exact path="/animals">
     <AnimalList />
    </Route>

    <Route exact path="/animals/create">
      <AnimalForm />
    </Route>

    <Route path="/animals/edit/:animalId(\d+)">
      <AnimalForm />
    </Route> */}


    {/*
      :animalId(\d+) - serves as a variable to hold the actual value that will be in the URL.
      For example, http://localhost:3000/animals/detail/3, the value of 3 will be stored in animalId. 
      The variable can then be accessed and used inside AnimalDetail
    */}

    {/* <Route exact path="/animals/detail/:animalId(\d+)">
      <AnimalDetail />
    </Route>
   </CustomerProvider></LocationProvider></AnimalProvider> */}


   {/* Render the animal list when http://localhost:3000/customers */}
   {/* <CustomerProvider>
    <Route path="/customers">
     <CustomerList />
    </Route>
   </CustomerProvider> */}


   {/* Render the animal list when http://localhost:3000/employees */}
   {/* <EmployeeProvider><LocationProvider>
     <Route exact path="/employees/create">
       <EmployeeForm />
     </Route>

    <Route exact path="/employees">
     <EmployeeList />
    </Route>

    <Route exact path="/employees/detail/:employeeId(\d+)">
      <EmployeeDetail />
    </Route>
  </LocationProvider></EmployeeProvider> */}

  </>
 )
} // ApplicationViews