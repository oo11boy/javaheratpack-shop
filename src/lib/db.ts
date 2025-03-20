import mysql from "mysql2/promise";

const dbConfig = {
  host: "db4free.net", // مثلاً db4free.net یا IP سرور
  user: "javaheratnew1245",
  password: "Ra13781379",
  database: "javaheratnew1245",
  port: 3306, 
};

export async function getConnection() {
  return await mysql.createConnection(dbConfig);
}