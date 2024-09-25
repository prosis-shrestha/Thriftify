class EmailHtmlService {
  getEmalConfirmationHtml(confirmationHash) {
    return `<div>

        <h1 style="color:#0e0b3d" > Thriftify  </h1> </br>
           <h1 style="color:#0e0b3d" > Confirm your email to continue to Thriftify   </h1> </br>
       <h4 style="color:#0e0b3d"> You are closer to be the part of Thriftify .  </h4> </br> 
       </br><h4 style="color:#0e0b3d">Click the button below to confirm your email address. </h4> <br/> <a style="background:#686de0;height:40px; text-decoration:none;  padding:8px ; cursor:pointer;letter-spacing:1px; border-radius:4px;text-align:center;color:white;" href="${process.env.FRONTEND_URL}/account/email-confirmation?hash=${confirmationHash}"> CONFIRM EMAIL </a> </br> <br> <br>  </div>`;
  }
  buyHtml({ email, username }) {
    return `<div>

        <h1 style="color:#0e0b3d" > Thriftify  </h1> </br>
           <h1 style="color:#0e0b3d" > Congratulation , ${username} bought your product   </h1> </br>
       <h4 style="color:#0e0b3d"> You can contact the buyer to complete the transaction . Here is the buyers email . <b> ${email}</b> </h4> </br> 
       </br>
        </div>`;
  }
}
module.exports = new EmailHtmlService();
