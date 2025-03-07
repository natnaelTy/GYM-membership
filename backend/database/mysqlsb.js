import mysql from "mysql2";

export const pool = mysql.createPool({
    host: "localhost" || "127.0.0.1",
    user: "root",
    password: "nati0975329588@babi",
    database: "gymmembership",
    port: 3306
});