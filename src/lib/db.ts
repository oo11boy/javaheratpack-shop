import mysql from "mysql2/promise";

const dbConfig = {
  host: process.env.DBHOST || "",
  user: process.env.DBUSER || "",
  password: process.env.DBPASSWORD || "",
  database: process.env.DBNAME || "",
  port: parseInt(process.env.DBPORT || "3306"),
};

export async function getConnection() {
  return await mysql.createConnection(dbConfig);
}

