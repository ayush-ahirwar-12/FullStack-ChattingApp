
const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
    service:"gmail",
    auth:{
        user:"ayushahirwar04gmail.com",
        pass:process.env.NODEMAILER_PASS
    }
})
export const sendMail = async(to,subject,htmlContent)=>{
    let info={
        from:"ayushahirwar04@gamil.com",
        to,
        subject,
        htmlContent
    }
    return await transporter.sendMail(info);
}