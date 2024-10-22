import express, { Express } from "express";
const app: Express = express();
const port: number = Number(process.env.PORT_NUM) || 8088;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
