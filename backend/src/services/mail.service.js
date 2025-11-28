import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "ayushahirwar04@gmail.com",
        pass: process.env.NODEMAILER_PASS
    }
});

export const sendMail = async (to, subject, htmlContent) => {
    const info = {
        from: "ayushahirwar04@gmail.com",
        to,
        subject,
        html: htmlContent // <-- correct key for HTML content
    };

    return await transporter.sendMail(info);
};
