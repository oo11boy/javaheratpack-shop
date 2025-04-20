import mysql from "mysql2/promise";

const dbConfig = {
  host: "45.139.10.148",
  user: "javaherat",
  password: "Ra1378!AbCd#1379",
  database: "javaherat",
  port: 3306,
};

export async function getConnection() {
  return await mysql.createConnection(dbConfig);
}