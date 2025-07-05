import { Header } from "../components/Header";

export function Home() {
    return(
        <>
        <Header/>
        <h1>Skapa din databasstruktur och få automatiskt SQL- och Java-kod.</h1>
        <input type="text" />
        <button>Create database</button>
        </>
    )
}