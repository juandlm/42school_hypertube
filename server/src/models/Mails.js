const nodemailer = require('nodemailer');

/*
 **  ---------   Configuration Nodemailer   -----------
 */

const mailAccountUser = process.env.MAIL_USER;
const mailAccountPassword = process.env.MAIL_PASS;
const mailLink = process.env.LINK;

const smtpTransport = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: mailAccountUser,
        pass: mailAccountPassword
    },
    tls: {
        rejectUnauthorized: false
    }
});

/*
 **  ---------   Envoi du mail   -----------
 */

const sendMail = (mail, res) => {
    try {
        smtpTransport.sendMail(mail, (err) => {
            if (err) {
                smtpTransport.close();
                res.status(400).end("Erreur lors de l'envoie du mail");
            } else {
                smtpTransport.close();
                res.end('OK');
            }
        });
    } catch (e) {
        return false;
    }
}

const sendMailSimple = (mail) => {
    try {
        smtpTransport.sendMail(mail, (err) => {
            if (err)
                smtpTransport.close();
            else
                smtpTransport.close();
        });
    } catch (e) {
        return false;
    }
}

/*
 **  ---------   Mails   -----------
 */

const mailSignup = (dest, username, token, res) => {
    const link = `${mailLink}registerValidation?username=${username}&key=${token}`;
    const message =
        `<html>
            <body>
                <center>
                    <img 
                        src="cid:logo" 
                        alt="HYPERTUBE"
                        style="
                            width: 550px;
                            height: auto" 
                    />
                    <h2 
                        style="
                            padding-top: 50px;
                            padding-bottom: 75px;
                            font-family: 'Roboto', 'Helvetica', 'Arial', sans-serif;"
                    >
                        To have access to all our films and series, you only have one last step left !
                    </h2>
                    <a 
                        href="${link}" 
                        style="
                            background-color: rgb(66, 83, 175);
                            padding: 25px 45px;
                            font-size: 0.875rem;
                            border-radius: 3px; 
                            color: white;
                            font-family: 'Roboto', 'Helvetica', 'Arial', sans-serif;
                            font-weight: 500;
                            line-height: 1.75;
                            letter-spacing: 0.02857em;
                            text-transform: uppercase;
                            text-decoration: none;
                            margin-top: 50px;
                            margin-bottom: 50px"
                    >
                        Confirm your registration
                    </a>
                    <br /><br /><br />
                    <small>This email is automatic, please do not answer it.</small>
                </center>
            </body>
        </html>`;

    const mail = {
        from: mailAccountUser,
        to: dest,
        subject: 'HYPERTUBE | Registration confirmation',
        html: message,
        attachments: [{
            filename: 'logo.png',
            path: `${__dirname}/../../public/logo.png`,
            cid: 'logo'
        }]
    }
    sendMail(mail, res);
}

const mailLoginForgotten = (dest, username, token, res) => {
    const link = `${mailLink}loginNewPassword?username=${username}&key=${token}`;
    const message =
        `<html>
            <body>
                <center>
                    <img 
                        src="cid:logo" 
                        alt="HYPERTUBE"
                        style="
                            width: 550px;
                            height: auto" 
                    />
                    <h2 
                        style="
                            padding-top: 50px;
                            padding-bottom: 75px;
                            font-family: 'Roboto', 'Helvetica', 'Arial', sans-serif;"
                    >
                        Click on the button below to access the page allowing you to reset your password.
                    </h2>
                    <a 
                        href="${link}" 
                        style="
                            background-color: rgb(66, 83, 175);
                            padding: 25px 45px;
                            font-size: 0.875rem;
                            border-radius: 3px; 
                            color: white;
                            font-family: 'Roboto', 'Helvetica', 'Arial', sans-serif;
                            font-weight: 500;
                            line-height: 1.75;
                            letter-spacing: 0.02857em;
                            text-transform: uppercase;
                            text-decoration: none;
                            margin-top: 50px;
                            margin-bottom: 50px"
                    >
                        Reset password
                    </a>
                    <br /><br /><br />
                    <small>This email is automatic, please do not answer it.</small>
                </center>
            </body>
        </html>`;

    const mail = {
        from: mailAccountUser,
        to: dest,
        subject: 'HYPERTUBE | Reset password',
        html: message,
        attachments: [{
            filename: 'logo.png',
            path: `${__dirname}/../../public/logo.png`,
            cid: 'logo'
        }]
    }
    sendMail(mail, res);
}

const mailOAuth = (dest, email, password, username, oAuth) => {
    const message =
        `<html>
            <body>
                <center>
                    <img 
                        src="cid:logo" 
                        alt="HYPERTUBE"
                        style="
                            width: 550px;
                            height: auto" 
                    />
                    <h2 
                        style="
                            padding-top: 50px;
                            padding-bottom: 75px;
                            font-family: 'Roboto', 'Helvetica', 'Arial', sans-serif;"
                    >
                        You have registered with ${oAuth} your account at Hypertube.<br />Here is your account information to connect to the site without your ${oAuth} account.
                    </h2>
                    <p>Username : <strong>${username}</strong></p>
                    <p>Connection email : <strong>${email}</strong></p>
                    <p>Password : <strong>${password}</strong></p>
                    <br /><br /><br />
                    <small>This email is automatic, please do not answer it.</small>
                </center>
            </body>
        </html>`;

    const mail = {
        from: mailAccountUser,
        to: dest,
        subject: 'HYPERTUBE | User information',
        html: message,
        attachments: [{
            filename: 'logo.png',
            path: `${__dirname}/../../public/logo.png`,
            cid: 'logo'
        }]
    }
    sendMailSimple(mail);
}

module.exports = {
    mailSignup,
    mailLoginForgotten,
    mailOAuth
};