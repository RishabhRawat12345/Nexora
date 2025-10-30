const express=require("express");
const cors=require("cors");
const database=require("./Db/Database");
const productRoute = require("./routes/Product_routes");
const app=express();
require("dotenv").config()
database();
app.use(express.json());

app.use(cors());

app.use("/api/products", productRoute);


const P=process.env.PORT;

app.listen(P,()=>{
    console.log(`the server is running at http://localhost:${P}`);
})


