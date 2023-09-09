import mysql from "mysql2/promise";

export default async function query({query, values = []}:any){
  const dbConnection = await mysql.createConnection({
    host: process.env.MYSQL_HOST,
    port: process.env.MYSQL_PORT,
    database: process.env.MYSQL_DATABASE,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD
  })

  try {
    const [results] = await dbConnection.query(query, values)
    await dbConnection.end()
    return results;

  } catch (error) {
    console.log(error);
    return { error };
  }
}
