const mongoose=require("mongoose");


const database=async(req,res)=>{
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Mongo is connected");
    } catch (error) {
        console.log(error);
    }
}

module.exports=database;