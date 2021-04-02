import React, { useState } from "react"
import { Link, useHistory } from "react-router-dom";
import { authApi, userStorageKey } from "./authSettings"

import styles from "./Login.module.css"


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
        <main className={styles.container__login}>
            <dialog className={`${styles.dialog} ${styles.dialog__auth}`} open={existDialog}>
                <div className={styles.dialog__message}>User does not exist</div>
                <button className={styles.button__close} onClick={e => setExistDialog(false)}>Close</button>
            </dialog>
            <section>
                <form className={styles.containerform__login} onSubmit={handleLogin}>
                    <h1 className={styles.containerForm__header}>PackItUp</h1>
                    <fieldset className={styles.container__fieldset}>
                        <label className={styles.emailLable} htmlFor="email"> Email address </label>
                        <input type="email"
                            id="email"
                            className={styles.formControl}
                            placeholder="Email address"
                            required autoFocus
                            value={loginUser.email}
                            onChange={handleInputChange} />
                    </fieldset>
                    <fieldset className={styles.container__fieldset__btn}>
                        <button className={styles.container__btn__submit} type="submit">
                            Sign in
                        </button>
                    </fieldset>
                </form>
            </section>
            <section className={styles.link__register}>
                <Link className={styles.container__register__link} to="/register">Register for an account</Link>
            </section>
        </main>
    )
}

