
import React from "react"
import { Route } from "react-router-dom"
import { UserPage } from "./routes/users/UserPage"
// import { Home } from "./Home"

// import { CustomerList } from "./customer/CustomerList"
// import { CustomerProvider } from "./customer/CustomerProvider"

// import { AnimalList } from "./animal/AnimalList"
// import { AnimalForm } from "./animal/AnimalForm"
// import { AnimalDetail } from "./animal/AnimalDetail"
// import { AnimalProvider } from "./animal/AnimalProvider"

// import { EmployeeList } from "./employee/EmployeeList"
// import { EmployeeForm } from "./employee/EmployeeForm"
// import { EmployeeDetail } from "./employee/EmployeeDetail"
// import { EmployeeProvider } from "./employee/EmployeeProvider"

// import { LocationList } from "./location/LocationList"
// import { LocationProvider } from "./location/LocationProvider"
// import { LocationForm } from "./location/LocationForm"
// import { LocationDetail } from "./location/LocationDetail"


export const ApplicationViews = () => {
 return (
  <>
    {/* <Route exact path="/users">
      <UserPage />
    </Route> */}

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