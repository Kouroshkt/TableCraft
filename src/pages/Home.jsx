import { useState } from "react";
import "../styles/Home.css";

export function Home() {
    const [database, setDatabase] = useState("");
    const [showDatabase, setShowDatabase] = useState(true);
    const [showChangedatabase, setShowChangedatabase] = useState(false);

    const saveDatabase = () => {
        if (!database) {
            alert("Du måste ange ett databasnamn.");
            return;
        }
        setShowDatabase(false);
        setShowChangedatabase(true);
    };

    const changeDatabase = () => {
        setShowDatabase(true);
        setShowChangedatabase(false);
    };

    const sqlTypes = [
        "CHAR", "VARCHAR(50)", "VARCHAR(100)", "VARCHAR(250)", "TEXT",
        "TINYINT", "SMALLINT", "INT", "BIGINT",
        "DECIMAL(10,2)", "NUMERIC(10,2)", "FLOAT", "DOUBLE",
        "DATE", "TIME", "DATETIME", "TIMESTAMP",
        "BOOLEAN", "UUID", "ENUM", "JSON", "BLOB"
    ];
    const relationTypes = ["OneToOne", "OneToMany", "ManyToOne", "ManyToMany"];

    const [table, setTable] = useState({ name: "", columns: [] });
    const [tables, setTables] = useState([]);

    const [column, setColumn] = useState({
        id: crypto.randomUUID(),
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
        reference: { table: "", column: "" }
    });

    const addColumn = () => {
        if (!column.name || (!column.type && !column.foreignKey)) {
            alert("Fyll i namn och typ för kolumnen");
            return;
        }
        setTable(prev => ({
            ...prev,
            columns: [...prev.columns, column]
        }));
        setColumn({
            id: crypto.randomUUID(),
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
            reference: { table: "", column: "" }
        });
    };

   const createTable = () => {
    if (!table.name || table.columns.length === 0 || !database) {
        alert("Ange tabellnamn, databasnamn och minst en kolumn");
        return;
    }

    // Kontrollera att minst en kolumn är primary key
    const hasPrimaryKey = table.columns.some(col => col.primaryKey);
    if (!hasPrimaryKey) {
        alert("Minst en kolumn måste vara Primary Key!");
        return;
    }

    setTables(prev => [...prev, table]);
    setTable({ name: "", columns: [] });
};


    const Display = () => (
    <div className="display">
        {tables.map((table, index) => (
            <table key={index} className="table-display">
                <thead>
                    <tr>
                        <th colSpan="10">{table.name}</th>
                    </tr>
                    <tr>
                        <th>Name</th>
                        <th>Type</th>
                        <th>Default</th>
                        <th>Primary Key</th>
                        <th>Foreign Key</th>
                        <th>Relation</th>
                        <th>Related Table</th>
                        <th>Auto Increment</th>
                        <th>Unique</th>
                        <th>Not Null</th>
                    </tr>
                </thead>
                <tbody>
                    {table.columns.map((col) => (
                        <tr key={col.id}>
                            <td>{col.name}</td>
                            <td>{col.type}</td>
                            <td>{col.defaultValue || "-"}</td>
                            <td>{col.primaryKey ? "Yes" : "No"}</td>
                            <td>{col.foreignKey ? "Yes" : "No"}</td>
                            <td>{col.relationType || "-"}</td>
                            <td>{col.relatedTable || "-"}</td>
                            <td>{col.autoIncrement ? "Yes" : "No"}</td>
                            <td>{col.unique ? "Yes" : "No"}</td>
                            <td>{col.notNull ? "Yes" : "No"}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        ))}
    </div>
);

    // ================= SQL EXPORT =================
    const [showSqlSection, setShowSqlSection] = useState(false);
    const [sqlCode, setSqlCode] = useState("");

    const handelSqlCode = () => {
        if (!tables || tables.length === 0 || !database) {
            alert("You must provide a database name and at least one table.");
            return;
        }

        let code = `CREATE DATABASE ${database};
USE ${database};\n\n`;

        tables.forEach(table => {
            const columnsSql = table.columns
                .filter(col => col.relationType !== "ManyToMany")
                .map(col => {
                    let line = `  ${col.name} ${col.type || "TEXT"}`;
                    if (col.primaryKey) line += " PRIMARY KEY";
                    if (col.autoIncrement) line += " AUTOINCREMENT";
                    if (col.notNull) line += " NOT NULL";
                    if (col.unique) line += " UNIQUE";
                    if (col.defaultValue) line += ` DEFAULT ${col.defaultValue}`;
                    return line;
                })
                .join(",\n");

            const foreignKeys = table.columns
                .filter(col => col.foreignKey && col.relatedTable && col.relationType !== "ManyToMany")
                .map(col => `  FOREIGN KEY (${col.name}) REFERENCES ${col.relatedTable}(id)`);

            const allConstraints = columnsSql + (foreignKeys.length > 0 ? ",\n" + foreignKeys.join(",\n") : "");
            code += `CREATE TABLE ${table.name} (\n${allConstraints}\n);\n\n`;

            // ManyToMany join tables
            table.columns
                .filter(col => col.relationType === "ManyToMany" && col.relatedTable)
                .forEach(col => {
                    const joinTableName = `${table.name}_${col.relatedTable}`;
                    code += `CREATE TABLE ${joinTableName} (\n`;
                    code += `  ${table.name.toLowerCase()}_id INT NOT NULL,\n`;
                    code += `  ${col.relatedTable.toLowerCase()}_id INT NOT NULL,\n`;
                    code += `  FOREIGN KEY (${table.name.toLowerCase()}_id) REFERENCES ${table.name}(id),\n`;
                    code += `  FOREIGN KEY (${col.relatedTable.toLowerCase()}_id) REFERENCES ${col.relatedTable}(id)\n`;
                    code += `);\n\n`;
                });
        });

        setSqlCode(code.trim());
        setShowSqlSection(true);
    };

    const SQL = () => {
        const copySqlToClipboard = () => {
            if (!sqlCode) return;
            navigator.clipboard.writeText(sqlCode)
                .then(() => alert("SQL code copied to clipboard!"))
                .catch(() => alert("Failed to copy SQL code."));
        };

        return (
            <>
                <button onClick={handelSqlCode}>Export to SQL code</button>
                {showSqlSection && (
                    <div className="sqlSection">
                        <button onClick={copySqlToClipboard}>Copy SQL code</button>
                        <pre>{sqlCode}</pre>
                    </div>
                )}
            </>
        );
    };

    // ================= JAVA EXPORT =================
    const [showJavaSection, setShowJavaSection] = useState(false);
    const [javaCode, setJavaCode] = useState("");

    const sqlToJavaType = (sqlType) => {
        if (!sqlType) return "String";
        const type = sqlType.toUpperCase();
        if (["INT", "INTEGER", "SMALLINT", "TINYINT"].includes(type)) return "int";
        if (["BIGINT"].includes(type)) return "long";
        if (["DECIMAL", "NUMERIC", "FLOAT", "DOUBLE"].some(t => type.startsWith(t))) return "double";
        if (["BOOLEAN"].includes(type)) return "boolean";
        if (["DATE"].includes(type)) return "LocalDate";
        if (["TIME"].includes(type)) return "LocalTime";
        if (["DATETIME", "TIMESTAMP"].includes(type)) return "LocalDateTime";
        if (["UUID"].includes(type)) return "UUID";
        return "String";
    };

    const handelJavaCode = () => {
        if (!tables || tables.length === 0) {
            alert("You have no tables.");
            return;
        }

        const code = tables.map(table => {
            const fields = table.columns.map(col => {
                const annotations = [];
                let fieldType;

                // Primary Key
                if (col.primaryKey) {
                    annotations.push("@Id");
                    if (col.autoIncrement) annotations.push("@GeneratedValue(strategy = GenerationType.IDENTITY)");
                }

                // Foreign Key relations
                if (col.foreignKey && col.relatedTable) {
                    switch (col.relationType) {
                        case "OneToOne":
                            annotations.push("@OneToOne");
                            annotations.push(`@JoinColumn(name = "${col.name}", referencedColumnName = "id")`);
                            fieldType = col.relatedTable;
                            break;
                        case "ManyToOne":
                            annotations.push("@ManyToOne");
                            annotations.push(`@JoinColumn(name = "${col.name}", referencedColumnName = "id")`);
                            fieldType = col.relatedTable;
                            break;
                        case "OneToMany":
                            annotations.push("@OneToMany(mappedBy = \"" + table.name.toLowerCase() + "\")");
                            fieldType = `List<${col.relatedTable}>`;
                            break;
                        case "ManyToMany":
                            annotations.push("@ManyToMany");
                            annotations.push("@JoinTable(name = \"" + table.name + "_" + col.relatedTable + "\", " +
                                             "joinColumns = @JoinColumn(name = \"" + table.name.toLowerCase() + "_id\"), " +
                                             "inverseJoinColumns = @JoinColumn(name = \"" + col.relatedTable.toLowerCase() + "_id\"))");
                            fieldType = `List<${col.relatedTable}>`;
                            break;
                        default:
                            annotations.push("@ManyToOne");
                            annotations.push(`@JoinColumn(name = "${col.name}", referencedColumnName = "id")`);
                            fieldType = col.relatedTable;
                    }
                } else {
                    if (col.notNull || col.unique) {
                        let columnAttrs = [];
                        if (col.notNull) columnAttrs.push("nullable = false");
                        if (col.unique) columnAttrs.push("unique = true");
                        annotations.push(`@Column(${columnAttrs.join(", ")})`);
                    }
                    fieldType = sqlToJavaType(col.type);
                }

                return `${annotations.join("\n    ")}\n    private ${fieldType} ${col.name};`;
            }).join("\n\n    ");

            return `import jakarta.persistence.*;\nimport lombok.AllArgsConstructor;\nimport lombok.Data;\nimport lombok.NoArgsConstructor;\nimport java.util.*;\nimport java.time.*;\n
@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ${table.name} {

    ${fields}

}`;
        }).join("\n\n");

        setJavaCode(code);
        setShowJavaSection(true);
    };

    const ToJava = () => {
        const copyJavaToClipboard = () => {
            if (!javaCode) return;
            navigator.clipboard.writeText(javaCode)
                .then(() => alert("Java code copied to clipboard!"))
                .catch(() => alert("Failed to copy Java code."));
        };

        return (
            <>
                <button onClick={handelJavaCode}>Export to Java</button>
                {showJavaSection && (
                    <div className="JavaSection">
                        <button onClick={copyJavaToClipboard}>Copy Java code</button>
                        <pre>{javaCode}</pre>
                    </div>
                )}
            </>
        );
    };

    // ================= JSX =================
    return (
        <>
            <div>
                <h2 style={{ textAlign: "center" }}>
                    Design your database and get real-time SQL and Java code.
                </h2>
                {showDatabase &&
                    <div className="createDatabase">
                        <input type="text" value={database} onChange={(e) => setDatabase(e.target.value)} placeholder="Database name" />
                        <button onClick={saveDatabase}>Create database</button>
                    </div>}
                {showChangedatabase && <button onClick={changeDatabase}>Byt databasnamn</button>}
                {showChangedatabase && <p>Name database: <b>{database}</b></p>}
            </div>

            <section className="tableSection">
                <div className="createTable">
                    <div className="tableContainer">
                        <input value={table.name} type="text" placeholder="Table Name"
                            onChange={(e) => setTable({ ...table, name: e.target.value })} />
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
                                <input type="text" placeholder="Column name"
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
                                <label>
                                    <input checked={column.primaryKey} type="checkbox"
                                        onChange={(e) => setColumn({ ...column, primaryKey: e.target.checked })} /> Primary key
                                </label>
                                <label>
                                    <input checked={column.foreignKey} type="checkbox"
                                        onChange={(e) => setColumn({ ...column, foreignKey: e.target.checked })} /> Foreign key
                                </label>
                                <label>
                                    <input checked={column.autoIncrement} type="checkbox"
                                        onChange={(e) => setColumn({ ...column, autoIncrement: e.target.checked })} /> Auto Increment
                                </label>
                                <label>
                                    <input checked={column.unique} type="checkbox"
                                        onChange={(e) => setColumn({ ...column, unique: e.target.checked })} /> Unique
                                </label>
                                <label>
                                    <input checked={column.notNull} type="checkbox"
                                        onChange={(e) => setColumn({ ...column, notNull: e.target.checked })} /> Not null
                                </label>
                            </div>
                        </div>

                        {column.foreignKey && (
                            <div className="underCloumns">
                                Create relation with table:
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
                            </div>
                        )}
                        <button onClick={addColumn}>ADD column</button>
                    </div>
                    <button onClick={createTable}>Create table</button>
                </div>
            </section>

            <Display />

            <div className="codeSection">
                <SQL />
                <ToJava />
            </div>
        </>
    );
}
