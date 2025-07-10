import { useState } from "react";
import "../styles/Header.css";

export function Header() {
    // Visningsflaggor
    const [showForm, setShowForm] = useState(false);
    const [showButton, setShowButton] = useState(true);
    const [showCreateAccount, setShowCreateAccount] = useState(false);

    // Inloggningsfält
    const [loginUsername, setLoginUsername] = useState('');
    const [loginPassword, setLoginPassword] = useState('');

    // Registreringsfält
    const [registerUsername, setRegisterUsername] = useState('');
    const [registerPassword, setRegisterPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');

    const handleLoginClick = () => {
        setShowForm(true);
        setShowCreateAccount(false);
        setShowButton(false);
    };

    const handleCreateAccountClick = () => {
        setShowCreateAccount(true);
        setShowForm(false);
        setShowButton(false);
    };

    const RequestLogin = () => {
        if (!loginUsername || !loginPassword) {
            alert("Fyll i både användarnamn och lösenord.");
            return;
        }

        // Här kan du lägga till riktig inloggningslogik t.ex. API-anrop
    };

    return (
        <div className="headerSection">
            <div className="buttons">
                {showButton ? <button onClick={handleLoginClick}>Logga in</button>: <p></p>}

                {showForm && (
                    <div className="login">
                        <label>Användarnamn</label>
                        <input
                            type="text"
                            value={loginUsername}
                            onChange={(e) => setLoginUsername(e.target.value)}
                        />
                        <label>Lösenord</label>
                        <input
                            type="password"
                            value={loginPassword}
                            onChange={(e) => setLoginPassword(e.target.value)}
                        />
                        <button onClick={RequestLogin}>Logga in</button>
                        <button onClick={() => {
                            setShowForm(false);
                            setShowButton(true);
                        }}>X</button>
                    </div>
                )}

                {showCreateAccount && (
                    <div className="login">
                        <label>Användarnamn</label>
                        <input
                            type="text"
                            value={registerUsername}
                            onChange={(e) => setRegisterUsername(e.target.value)}
                        />
                        <label>Lösenord</label>
                        <input
                            type="password"
                            value={registerPassword}
                            onChange={(e) => setRegisterPassword(e.target.value)}
                        />
                        <label>Upprepa lösenord</label>
                        <input
                            type="password"
                            value={repeatPassword}
                            onChange={(e) => setRepeatPassword(e.target.value)}
                        />
                        <button>Skapa konto</button>
                        <button onClick={() => {
                            setShowCreateAccount(false);
                            setShowButton(true);
                        }}>X</button>
                    </div>
                )}

                {showButton ? <button onClick={handleCreateAccountClick}>Skapa konto</button>:<p></p>}
            </div>
        </div>
    );
}
