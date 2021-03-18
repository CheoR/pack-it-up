import React, { useState } from "react"
import { Link, useHistory } from "react-router-dom";
import { authApi, userStorageKey } from "./authSettings"

import "./Login.css"


export const Login = () => {
    const [loginUser, setLoginUser] = useState({ email: "" })
    const [existDialog, setExistDialog] = useState(false)

    const history = useHistory()

    const handleInputChange = (event) => {
        const newUser = { ...loginUser }
        newUser[event.target.id] = event.target.value
        setLoginUser(newUser)
    }


    const existingUserCheck = () => {
        return fetch(`${authApi.localApiBaseUrl}/${authApi.endpoint}?email=${loginUser.email}`)
            .then(res => res.json())
            .then(user => user.length ? user[0] : false)
    }

    const handleLogin = (e) => {
        e.preventDefault()

        existingUserCheck()
            .then(exists => {
                if (exists) {
                    sessionStorage.setItem(userStorageKey, exists.id)
                    history.push("/users")
                } else {
                    setExistDialog(true)
                }
            })
    }

    return (
        <main className="container--login">
            <dialog className="dialog dialog--auth" open={existDialog}>
                <div className="dialog__message">User does not exist</div>
                <button className="button--close" onClick={e => setExistDialog(false)}>Close</button>
            </dialog>
            <section>
                <form className="containerform--login" onSubmit={handleLogin}>
                    <h1 className="containerForm__header">PackItUp</h1>
                    <fieldset className="container__fieldset">
                        <label htmlFor="email"> Email address </label>
                        <input type="email"
                            id="email"
                            className="form-control"
                            placeholder="Email address"
                            required autoFocus
                            value={loginUser.email}
                            onChange={handleInputChange} />
                    </fieldset>
                    <fieldset className="container__fieldset--btn">
                        <button className="container__btn--submit" type="submit">
                            Sign in
                        </button>
                    </fieldset>
                </form>
            </section>
            <section className="link--register">
                <Link className="container__register--link" to="/register">Register for an account</Link>
            </section>
        </main>
    )
}

