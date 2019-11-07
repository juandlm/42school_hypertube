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
    smtpTransport.sendMail(mail, (err) => {
        if (err) {
            console.log("Erreur lors de l'envoie du mail");
            console.log(err);
            smtpTransport.close();
            res.status(400).end("Erreur lors de l'envoie du mail");
        } else {
            console.log("Mail envoyé avec succès");
            smtpTransport.close();
            res.end('OK');
        }
    });
}

const sendMailSimple = (mail) => {
    smtpTransport.sendMail(mail, (err) => {
        if (err) {
            console.log("Erreur lors de l'envoie du mail");
            console.log(err);
            smtpTransport.close();
        } else {
            console.log("Mail envoyé avec succès");
            smtpTransport.close();
        }
    });
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
                        Pour avoir accés à tous nos films et séries, il ne vous reste plus qu'une dernière étape !
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
                            Confirmer votre inscription
                    </a>
                    <br /><br /><br />
                    <small>Cet email est automatique, merci de ne pas y répondre.</small>
                </center>
            </body>
        </html>`;

    const mail = {
        from: mailAccountUser,
        to: dest,
        subject: 'HYPERTUBE | Confirmation inscription',
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
                        Cliquez sur le bouton ci-dessous pour accéder à la page vous permettant de réinitialiser votre mot de passe.
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
                        Réinitialiser mot de passe
                    </a>
                    <br /><br /><br />
                    <small>Cet email est automatique, merci de ne pas y répondre.</small>
                </center>
            </body>
        </html>`;

    const mail = {
        from: mailAccountUser,
        to: dest,
        subject: 'HYPERTUBE | Récupération mot de passe',
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
                        Vous vous etes inscit avec votre compte ${oAuth} à Hypertube.<br />Voici les informations de votre compte pour vous connecter au site sans votre compte ${oAuth}.
                    </h2>
                    <p>Nom d'utilisateur : <strong>${username}</strong></p>
                    <p>Email de connexion : <strong>${email}</strong></p>
                    <p>Mot de passe : <strong>${password}</strong></p>
                    <br /><br /><br />
                    <small>Cet email est automatique, merci de ne pas y répondre.</small>
                </center>
            </body>
        </html>`;

    const mail = {
        from: mailAccountUser,
        to: dest,
        subject: 'HYPERTUBE | Informations utilisateurs',
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