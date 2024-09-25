const jwt = require("jsonwebtoken");

class AuthService{
     getEmailConfirmationHash(email){
        const token = jwt.sign({ email }, process.env.CONFIRMATION_HASH, { expiresIn: 60 * 10 })
        return token;
    }
    async verifyIfEmailConfCodeIsValid(token) {

        try {

            const decoded = jwt.verify(token, process.env.CONFIRMATION_HASH)


            console.log("verifying jwt", decoded);

            return { email: decoded?.email, exp: false, invalidLink: false }
        } catch (error) {
            // console.log(error.message)
            if (error?.message === "jwt expired") {
               throw new Error("Link is expired" )
            } else {
                throw new Error("Invalid confirmation link")
            }

        }
    }
}


module.exports = new  AuthService()