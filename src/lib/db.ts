import mysql from "mysql2/promise";

const dbConfig = {
  host: "kamet.liara.cloud", // مثلاً db4free.net یا IP سرور
  user: "root",
  password: "z3cxqWDUCmE66so9js4ocoUT",
  database: "modest_darwin",
  port: 34464,
};

// const dbConfig = {
//   host: "db4free.net", // مثلاً db4free.net یا IP سرور
//   user: "javaheratnew1245",
//   password: "Ra13781379",
//   database: "javaheratnew1245",
//   port: 3306,
// };

// const dbConfig = {
//     host: "localhost", // مثلاً db4free.net یا IP سرور
//     user: "root",
//     password: "",
//     database: "javaheratnew1245",

//   };
export async function getConnection() {
  return await mysql.createConnection(dbConfig);
}
