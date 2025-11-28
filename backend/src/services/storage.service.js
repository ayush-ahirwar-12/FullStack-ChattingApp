const Imagekit = require("imagekit")

const imagekit = new Imagekit({
    publicKey:process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey:process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint:process.env.IMAGEKIT_URL_ENDPOINT,

})

const sendFiles = async(file,filename)=>{
try {
        const result =await imagekit.upload({
        file:file,
        fileName:filename,
        folder:"chatApp"
    })
    return result;
} catch (error) {
    console.log("error in storage service",error);
    
}

}

module.exports=sendFiles;