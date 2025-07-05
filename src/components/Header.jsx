import { useState } from "react"

export function Header() {
    const [showForm, setShowForm] = useState(false);
    const logning=()=>{
        setShowForm(true)
    }

    return (
        <div>
            <button onClick={logning}>Log in</button>
            {showForm &&
                (<div>
                    <label>User</label>
                    <input type="text" />
                    <label>Password</label>
                    <input type="text" />
                </div>)
            }
        </div>
    )
}