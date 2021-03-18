import React, { useState } from "react"
import { useHistory } from "react-router-dom"
import { authApi, userStorageKey } from "./authSettings"
import "./register.css"

export const Register = () => {

    const [registerUser, setRegisterUser] = useState({ 
        // firstName: "", 
        // lastName: "",
        username: "",
        email: "",
        password: "",
    })

    const [conflictDialog, setConflictDialog] = useState(false)

    const history = useHistory()

    const handleInputChange = (event) => {
        const newUser = { ...registerUser }
        newUser[event.target.id] = event.target.value
        setRegisterUser(newUser)
    }

    const existingUserCheck = () => {
        
        return fetch(`${authApi.localApiBaseUrl}/${authApi.endpoint}?email=${registerUser.email}`)
            .then(res => res.json())
            .then(user => !!user.length) /// turn length boolean
    }

    const handleRegister = (e) => {
        e.preventDefault()

        existingUserCheck()
            .then((userExists) => {
                if (!userExists) {
                    fetch(`${authApi.localApiBaseUrl}/${authApi.endpoint}`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            email: registerUser.email,
                            username: `${registerUser.username}`,
                            password: `${registerUser.password}`
                            // never save password like this
                            // name: `${registerUser.firstName} ${registerUser.lastName}`
                        })
                    })
                        .then(res => res.json())
                        .then(createdUser => {
                            if (createdUser.hasOwnProperty("id")) {
                                sessionStorage.setItem(userStorageKey, createdUser.id)
                                history.push("/")
                            }
                        })
                }
                else {
                    setConflictDialog(true)
                }
            })

    }

    return (
        <main className="registration">

            <dialog className="dialog dialog--password" open={conflictDialog}>
                <div>Account with that email address already exists</div>
                <button className="button--close" onClick={e => setConflictDialog(false)}>Close</button>
            </dialog>

            <form className="registration__form--login" onSubmit={handleRegister}>
                <h1 className="registration__header">Please Register for PackItUp</h1>
                <fieldset className="registration__fieldset">
                    <label htmlFor="username"> Username </label>
                    <input type="text" name="username" id="username" className="form-control" placeholder="Username" required autoFocus value={registerUser.username} onChange={handleInputChange} />
                </fieldset>
                <fieldset className="registration__fieldset">
                    <label htmlFor="inputEmail"> Email address </label>
                    <input type="email" name="email" id="email" className="form-control" placeholder="Email address" required value={registerUser.email} onChange={handleInputChange} />
                </fieldset>
                <fieldset className="registration__fieldset">
                    <label htmlFor="password"> Password </label>
                    <input type="password" name="password" id="password" className="form-control" placeholder="Password" required value={registerUser.password} onChange={handleInputChange} />
                </fieldset>
                <fieldset className="registration__fieldset--btn">
                    <button className="registration__btn--submit" type="submit"> Register </button>
                </fieldset>
            </form>
        </main>
    )
}

