import mongoose from "mongoose"
const connectdb = async()=>{
    try {
        await mongoose.connect(process.env.MONGOOSE_URI).then(()=>{
            console.log("Database connected");
            
        })
    } catch (error) {
        console.log("error in connecting database",error);
            process.exit(1);

        
    }
}

export default connectdb;