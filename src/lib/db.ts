import mysql from "mysql2/promise";

const dbConfig = {
  host: "localhost", // مثلاً db4free.net یا IP سرور
  user: "root",
  password: "",
  database: "javaherat",
  port: 3306, // پورت پیش‌فرض MySQL
};

export async function getConnection() {
  return await mysql.createConnection(dbConfig);
}