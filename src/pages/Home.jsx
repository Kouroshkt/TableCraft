import { useState } from "react";
import { Header } from "../components/Header";
import "../styles/Home.css"
export function Home() {
    const [database, setDatabase] = useState();
    const [showDatabase, setShowDatabase] = useState(true);
    const [showChangedatabase, setShowChangedatabase] = useState(false);

    const saveDatabase = () => {
        setShowDatabase(false);
        setShowChangedatabase(true);
    }
    const changeDatabase = () => {
        setShowDatabase(true);
        setShowChangedatabase(false);
    }
    const sqlTypes = [
        // Texttyper
        "CHAR", "VARCHAR(50)", "VARCHAR(100)", "VARCHAR(250)", "TEXT",

        // Numeriska typer
        "TINYINT", "SMALLINT", "INT", "BIGINT",
        "DECIMAL(10,2)", "NUMERIC(10,2)", // vanligt att specificera precision
        "FLOAT", "DOUBLE",

        // Datum och tid
        "DATE", "TIME", "DATETIME", "TIMESTAMP",

        // Övriga
        "BOOLEAN", "UUID", "ENUM", "JSON", "BLOB"
    ];
    const relationTypes = ["One-to-One", "One-to-Many", "Many-to-One", "Many-to-Many"];
    const [table, setTable] = useState({
        name: null,
        columns: []
    })
    const [tables, setTables] = useState([]);
    const [column, setColumn] = useState(
        {
            id: Date.now(),
            name: "",
            type: "",
            primaryKey: false,
            foreignKey: false,
            notNull: false,
            unique: false,
            autoIncrement: false,
            defaultValue: "",
            relationType: "",
            relatedTable: "",
            reference: {
                table: "",
                column: ""
            }
        }
    );
    console.log(column)
    console.log(table)
    const addColumn = () => {
        if (!column.name || !column.type) {
            alert("Fyll i namn och typ för kolumnen");
            return;
        }

        setTable(prev => ({
            ...prev,
            columns: [...(prev.columns || []), column]
        }));

        setColumn({
            id: Date.now(),
            name: "",
            type: "",
            primaryKey: false,
            foreignKey: false,
            notNull: false,
            unique: false,
            autoIncrement: false,
            defaultValue: "",
            relationType: "",
            relatedTable: "",
            reference: {
                table: "",
                column: ""
            }
        });
    };

    const createTable = () => {
        if (!table.name || table.columns.length === 0 || !database) {
            alert("Ange tabelnamn ,databas namn och minst en kolumn");
            return;
        }
        setTables(prev => [...prev, table]);
        setTable({ name: "", columns: [] });
    }
    const Display = () => {
        return (
            <div className="display">
                {tables.map((table, index) => (
                    <table key={index} className="table-display">
                        <thead>
                            <tr>
                                <th colSpan="2">{table.name}</th>
                            </tr>
                            <tr>
                                <th>Column name</th>
                                <th>Info</th>
                            </tr>
                        </thead>
                        <tbody>
                            {table.columns.map((col, colIndex) => (
                                <tr key={colIndex}>
                                    <td>{col.name}</td>
                                    <td>
                                        {col.foreignKey && `Foreign key → ${col.relatedTable}`}
                                    </td>
                                </tr>
                            ))}
                        </tbody>

                    </table>
                ))}
            </div>
        );
    };

    const [showSqlSection, setShowSqlSection] = useState(false);
    const [sqlCode, setSqlCode] = useState("");

    const handelSqlCode = () => {
        if (!tables || tables.length === 0) {
            alert("You have no tables.");
            return;
        }

        const code = tables.map(table => {
            const columnsSql = table.columns.map(col => {
                let line = `  ${col.name} ${col.type || "TEXT"}`;

                if (col.primaryKey) line += " PRIMARY KEY";
                if (col.autoIncrement) line += " AUTOINCREMENT";
                if (col.notNull) line += " NOT NULL";
                if (col.unique) line += " UNIQUE";
                if (col.defaultValue) line += ` DEFAULT ${col.defaultValue}`;
                if (col.foreignKey && col.relatedTable) {
                    line += ` REFERENCES ${col.relatedTable}`;
                }

                return line;
            }).join(",\n");

            return `CREATE TABLE ${table.name} (\n${columnsSql}\n);`;
        }).join("\n\n");

        setSqlCode(code);
        setShowSqlSection(true);
    };


    const SQL = () => {

        return (
            <>
                <button onClick={handelSqlCode}>Export to SQL code</button>
                {showSqlSection && (
                    <div className="sqlSection">
                        <pre>{sqlCode}</pre>
                    </div>
                )}
            </>
        );
    };


    return (
        <>
            <Header />
            <div>
                <h2 style={{ textAlign: "center" }}>
                    Design your database and get real-time SQL and Java code.
                </h2>
                {showDatabase &&
                    <div className="createDatabase">
                        <input type="text" value={database} onChange={(e) => setDatabase(e.target.value)} />
                        <button onClick={saveDatabase} >Create database</button>
                    </div>}
                {showChangedatabase && <button onClick={changeDatabase}>bytta databas namn</button>}
                {showChangedatabase && <p>Name database: <b>{database}</b></p>}
            </div>
            <section className="tableSection">

                <div className="createTable">

                    <div className="tableContainer">
                        <input value={table.name} type="text" placeholder="Table Name"
                            onChange={(e) => setTable({ ...table, name: e.target.value })
                            } />
                        <table className="tableView">
                            <thead>
                                <tr>
                                    <th>Column name</th>
                                    <th>Column type</th>
                                    <th>Default value</th>
                                    <th>Primary key</th>
                                    <th>Foreign key</th>
                                    <th>Relation type</th>
                                    <th>Related table</th>
                                    <th>Auto increment</th>
                                    <th>Unique</th>
                                    <th>Not null</th>
                                </tr>
                            </thead>
                            <tbody>
                                {table.columns.map((col) => (
                                    <tr key={col.id}>
                                        <td>{col.name}</td>
                                        <td>{col.type}</td>
                                        <td>{col.defaultValue}</td>
                                        <td>{col.primaryKey ? "Yes" : "No"}</td>
                                        <td>{col.foreignKey ? "Yes" : "No"}</td>
                                        <td>{col.relationType}</td>
                                        <td>{col.relatedTable}</td>
                                        <td>{col.autoIncrement ? "Yes" : "No"}</td>
                                        <td>{col.unique ? "Yes" : "No"}</td>
                                        <td>{col.notNull ? "Yes" : "No"}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                    </div>
                    <div className="columnsSection">
                        <div className="columns">
                            <div className="columnsRigth">
                                <input type="text" placeholder="Columns name"
                                    value={column.name} onChange={(e) =>
                                        setColumn({ ...column, name: e.target.value })} />
                                <select value={column.type} onChange={(e) =>
                                    setColumn({ ...column, type: e.target.value })}>
                                    <option value="" disabled hidden>Select type</option>
                                    {sqlTypes.map((type, index) =>
                                        <option key={index} value={type}>{type}</option>
                                    )}
                                </select>
                            </div>
                            <div className="checkboxs">
                                <input value={column.defaultValue} type="text" placeholder="Default Value"
                                    onChange={(e) => setColumn({ ...column, defaultValue: e.target.value })} />
                                <label >
                                    <input checked={column.primaryKey} type="checkbox"
                                        onChange={(e) => setColumn({ ...column, primaryKey: e.target.checked })
                                        } />Primar key</label>
                                <label >
                                    <input checked={column.foreignKey} type="checkbox"
                                        onChange={(e) => setColumn({ ...column, foreignKey: e.target.checked })
                                        } />Foreign key</label>
                                <label >
                                    <input checked={column.autoIncrement} type="checkbox"
                                        onChange={(e) => setColumn({ ...column, autoIncrement: e.target.checked })
                                        } />Auto Increment</label>
                                <label >
                                    <input checked={column.unique} type="checkbox"
                                        onChange={(e) => setColumn({ ...column, unique: e.target.checked })
                                        } />Unique</label>
                                <label >
                                    <input checked={column.notNull} type="checkbox"
                                        onChange={(e) => setColumn({ ...column, notNull: e.target.checked })
                                        } />not noll</label>
                            </div>
                        </div>
                        {column.foreignKey && (<div className="underCloumns">
                            create releation with table
                            <div className="createRigth">
                                <select value={column.relationType}
                                    onChange={(e) => setColumn({ ...column, relationType: e.target.value })}>
                                    <option value="" disabled hidden>Select relation type</option>
                                    {relationTypes.map((type, index) => (
                                        <option key={index} value={type}>{type}</option>
                                    ))}
                                </select>
                                <select value={column.relatedTable}
                                    onChange={(e) => setColumn({ ...column, relatedTable: e.target.value })}>
                                    <option value="" disabled hidden>Select related table</option>
                                    {tables.map((table, index) => (
                                        <option key={index} value={table.name}>{table.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>)}
                        <button onClick={addColumn}>ADD column</button>
                    </div>

                    <button onClick={createTable}>Create table</button>
                </div>
            </section>
            <Display />
            <SQL />

        </>
    )
}


