const mongoose = require("mongoose")
const connectdb = ()=>{
    try {
        mongoose.connect(process.env.MONGOOSE_URI).then(()=>{
            console.log("Database connected");
            
        })
    } catch (error) {
        console.log("error in connecting database",error);
        
    }
}

module.exports=connectdb;