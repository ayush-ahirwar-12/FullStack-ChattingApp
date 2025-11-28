import mongoose from "mongoose"
const connectdb = async()=>{
    try {
        mongoose.connection(process.env.MONGOOSE_URI).then(()=>{
            console.log("Database connected");
            
        })
    } catch (error) {
        console.log("error in connecting database",error);
        
    }
}

export default connectdb;