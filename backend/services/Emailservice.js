const nodemailer = require("nodemailer");
const EmailHtmlService = require("./EmailHtmlService");
const AuthService = require("./AuthService");




class EmailService {

    async sendEmail({ subject, text, html, email }) {



        let transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            
            auth: {
                pass: process.env.SMTP_PW,
                user: process.env.APP_EMAIL
            },
        }); 

        try {

            let info = await transporter.sendMail({
                from: process.env.APP_EMAIL,
                to: email,
                subject,
                text,
                html,
            });

            console.log("Message sent: %s", info.messageId);
            return info.messageId;

        } catch (error) {
            throw new Error(error)
        }
    }

    async sentEmailConfirmationEmail(email){
        const confirmationHash=AuthService.getEmailConfirmationHash(email)
        try {
            const emailPayload = {
                subject:"ThrifTrazzer send you a email confirmation link",
                text:"Email confirmation link",
                html:EmailHtmlService.getEmalConfirmationHtml(confirmationHash),
                email,
            }
           await this.sendEmail(emailPayload)

        } catch (error) {
            console.log(error)
            throw new Error(error.message)
        }
    }

    async sentBuyEmail(sellerEmail,buyerEmail,username){
        try {
            const emailPayload = {
                subject:`${username} bought your product in Thrift Treasure`,
                text: `${username} bought your product in Thrift Treasure`,
                html:EmailHtmlService.buyHtml({email:buyerEmail,username}),
                email:sellerEmail,
            }
           await this.sendEmail(emailPayload)

        } catch (error) {
            console.log(error)
            throw new Error(error.message)
        }
    }




}

module.exports = new EmailService()