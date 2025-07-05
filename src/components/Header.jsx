import { useState } from "react"
import "../styles/Header.css"

export function Header() {
    const [showForm, setShowForm] = useState(false);
    const [showCraeteAccount, setShowCreateAccount] = useState(false);
    const logning = () => {
        setShowForm(true);
        setShowCreateAccount(false);
    }
    const CreateAccount = () => {
        setShowCreateAccount(true);
        setShowForm(false);
    }

    return (
        <div className="headerSection">
            <div className="buttons">
                <button onClick={logning}>Log in</button>
                {showForm &&
                    (<div className="login">
                        <label>User</label>
                        <input type="text" />
                        <label>Password</label>
                        <input type="text" />
                        <button>Login</button>
                        <button onClick={() => setShowForm(false)}>X</button>
                    </div>
                    )}
                {showCraeteAccount &&
                    (<div className="login">
                        <label>User</label>
                        <input type="text" />
                        <label>Password</label>
                        <input type="text" />
                        <label>Reapet Password</label>
                        <input type="text" />
                        <button>Create account</button>
                        <button onClick={() => setShowCreateAccount(false)}>X</button>
                    </div>
                    )}
                <button onClick={CreateAccount}>Create account</button>
            </div>

        </div>
    )
}
