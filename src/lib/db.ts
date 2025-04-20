import mysql from "mysql2/promise";

const dbConfig = {
  host: "siah-kaman.liara.cloud", 
  user: "root",
  password: "Xi2YKsy6TZf2VAZF1qp30nsz",
  database: "epic_mccarthy",
  port: 32173,
};


export async function getConnection() {
  return await mysql.createConnection(dbConfig);
}
