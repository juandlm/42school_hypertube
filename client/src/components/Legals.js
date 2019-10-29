import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import CloseIcon from '@material-ui/icons/Close';
import { IconButton, Typography } from '@material-ui/core';

export default function Legals() {
    const [open, setOpen] = React.useState(false);
    const websiteName = 'HYPERTUBE';

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    }

    // ************************************************

    return (
        <div>
            <Button onClick={handleClickOpen} id="Legals">Mentions legales</Button>
            <Dialog
                open={open}
                onClose={handleClose}
                maxWidth="lg"
                fullWidth={true}
                scroll="body"
                aria-labelledby="scroll-dialog-title"
            >
                <DialogTitle disableTypography id="scroll-dialog-title" className="legalsClose">
                    <Typography component="h2" variant="h5">Mentions légales</Typography>
                    <IconButton onClick={handleClose} color="primary">
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent dividers>
                    <DialogTitle>1. Présentation du site.</DialogTitle>
                    <DialogContentText>
                        En vertu de l'article 6 de la loi n° 2004-575 du 21 juin 2004 pour la confiance dans l'économie numérique, il est précisé aux utilisateurs du site <a href='/'>{websiteName}</a> l'identité des différents intervenants dans le cadre de sa réalisation et de son suivi :<br /><br />
                        <strong>Propriétaire</strong> : Thomas SHELBY –  – Newton St, Birmingham B4 6UD, UK<br />
                        <strong>Créateur</strong>  : <a target="_blank" rel="noopener noreferrer" href="https://google.com">Thomas SHELBY</a><br />
                        <strong>Responsable publication</strong> : Thomas SHELBY – thomas@shelby.com<br />
                        Le responsable publication est une personne physique ou une personne morale.<br />
                        <strong>Webmaster</strong> : Thomas SHELBY – thomas@shelby.com<br />
                        <strong>Hébergeur</strong> : unknown – unknown<br /><br />
                        Le modèle de mentions légales est offert par <a target="_blank" rel="noopener noreferrer" href="https://www.subdelirium.com/generateur-de-mentions-legales/">Subdelirium.com</a>
                    </DialogContentText>

                    <DialogTitle>2. Conditions générales d’utilisation du site et des services proposés.</DialogTitle>
                    <DialogContentText>
                        L’utilisation du site <a href="/">{websiteName}</a> implique l’acceptation pleine et entière des conditions générales d’utilisation ci-après décrites. Ces conditions d’utilisation sont susceptibles d’être modifiées ou complétées à tout moment, les utilisateurs du site <a href="/">{websiteName}</a> sont donc invités à les consulter de manière régulière.<br />
                        Ce site est normalement accessible à tout moment aux utilisateurs. Une interruption pour raison de maintenance technique peut être toutefois décidée par Thomas SHELBY, qui s’efforcera alors de communiquer préalablement aux utilisateurs les dates et heures de l’intervention.<br />
                        Le site <a href="/">{websiteName}</a> est mis à jour régulièrement par Thomas SHELBY. De la même façon, les mentions légales peuvent être modifiées à tout moment : elles s’imposent néanmoins à l’utilisateur qui est invité à s’y référer le plus souvent possible afin d’en prendre connaissance.
                    </DialogContentText>

                    <DialogTitle>3. Description des services fournis.</DialogTitle>
                    <DialogContentText>
                        Le site <a href="/">{websiteName}</a> a pour objet de fournir une information concernant l’ensemble des activités de la société.<br />
                        Thomas SHELBY s’efforce de fournir sur le site <a href="/">{websiteName}</a> des informations aussi précises que possible. Toutefois, il ne pourra être tenue responsable des omissions, des inexactitudes et des carences dans la mise à jour, qu’elles soient de son fait ou du fait des tiers partenaires qui lui fournissent ces informations.<br />
                        Tous les informations indiquées sur le site <a href="/">{websiteName}</a> sont données à titre indicatif, et sont susceptibles d’évoluer. Par ailleurs, les renseignements figurant sur le site <a href="/">{websiteName}</a> ne sont pas exhaustifs. Ils sont donnés sous réserve de modifications ayant été apportées depuis leur mise en ligne.
                    </DialogContentText>
  
                    <DialogTitle>4. Limitations contractuelles sur les données techniques.</DialogTitle>
                    <DialogContentText>
                        Le site utilise la technologie JavaScript.<br />
                        Le site Internet ne pourra être tenu responsable de dommages matériels liés à l’utilisation du site. De plus, l’utilisateur du site s’engage à accéder au site en utilisant un matériel récent, ne contenant pas de virus et avec un navigateur de dernière génération mis-à-jour.
                    </DialogContentText>
                
                    <DialogTitle>5. Propriété intellectuelle et contrefaçons.</DialogTitle>
                    <DialogContentText>
                        Thomas SHELBY est propriétaire des droits de propriété intellectuelle ou détient les droits d’usage sur tous les éléments accessibles sur le site, notamment les textes, images, graphismes, logo, icônes, sons, logiciels.<br />
                        Toute reproduction, représentation, modification, publication, adaptation de tout ou partie des éléments du site, quel que soit le moyen ou le procédé utilisé, est interdite, sauf autorisation écrite préalable de : Thomas SHELBY.<br />
                        Toute exploitation non autorisée du site ou de l’un quelconque des éléments qu’il contient sera considérée comme constitutive d’une contrefaçon et poursuivie conformément aux dispositions des articles L.335-2 et suivants du Code de Propriété Intellectuelle.
                    </DialogContentText>

                    <DialogTitle>6. Limitations de responsabilité.</DialogTitle>
                    <DialogContentText>
                        Thomas SHELBY ne pourra être tenue responsable des dommages directs et indirects causés au matériel de l’utilisateur, lors de l’accès au site URL, et résultant soit de l’utilisation d’un matériel ne répondant pas aux spécifications indiquées au point 4, soit de l’apparition d’un bug ou d’une incompatibilité.<br />
                        Thomas SHELBY ne pourra également être tenue responsable des dommages indirects (tels par exemple qu’une perte de marché ou perte d’une chance) consécutifs à l’utilisation du site <a href="/">{websiteName}</a>.<br />
                        Des espaces interactifs (possibilité de poser des questions dans l’espace contact) sont à la disposition des utilisateurs. Thomas SHELBY se réserve le droit de supprimer, sans mise en demeure préalable, tout contenu déposé dans cet espace qui contreviendrait à la législation applicable en France, en particulier aux dispositions relatives à la protection des données. Le cas échéant, Thomas SHELBY se réserve également la possibilité de mettre en cause la responsabilité civile et/ou pénale de l’utilisateur, notamment en cas de message à caractère raciste, injurieux, diffamant, ou pornographique, quel que soit le support utilisé (texte, photographie…).    
                    </DialogContentText>                
 
                    <DialogTitle>7. Gestion des données personnelles.</DialogTitle>
                    <DialogContentText>
                        En France, les données personnelles sont notamment protégées par la loi n° 78-87 du 6 janvier 1978, la loi n° 2004-801 du 6 août 2004, l'article L. 226-13 du Code pénal et la Directive Européenne du 24 octobre 1995.<br />
                        A l'occasion de l'utilisation du site <a href="/">{websiteName}</a>, peuvent êtres recueillies : l'URL des liens par l'intermédiaire desquels l'utilisateur a accédé au site <a href="/">{websiteName}</a>, le fournisseur d'accès de l'utilisateur, l'adresse de protocole Internet (IP) de l'utilisateur.<br />
                        En tout état de cause Thomas SHELBY ne collecte des informations personnelles relatives à l'utilisateur que pour le besoin de certains services proposés par le site <a href="/">{websiteName}</a>. L'utilisateur fournit ces informations en toute connaissance de cause, notamment lorsqu'il procède par lui-même à leur saisie. Il est alors précisé à l'utilisateur du site <a href="/">{websiteName}</a> l’obligation ou non de fournir ces informations.<br />
                        Conformément aux dispositions des articles 38 et suivants de la loi 78-17 du 6 janvier 1978 relative à l’informatique, aux fichiers et aux libertés, tout utilisateur dispose d’un droit d’accès, de rectification et d’opposition aux données personnelles le concernant, en effectuant sa demande écrite et signée, accompagnée d’une copie du titre d’identité avec signature du titulaire de la pièce, en précisant l’adresse à laquelle la réponse doit être envoyée.<br />
                        Aucune information personnelle de l'utilisateur du site <a href="/">{websiteName}</a> n'est publiée à l'insu de l'utilisateur, échangée, transférée, cédée ou vendue sur un support quelconque à des tiers. Seule l'hypothèse du rachat de Thomas SHELBY et de ses droits permettrait la transmission des dites informations à l'éventuel acquéreur qui serait à son tour tenu de la même obligation de conservation et de modification des données vis à vis de l'utilisateur du site <a href="/">{websiteName}</a>.<br />
                        Le site n'est pas déclaré à la CNIL car il ne recueille pas d'informations personnelles.<br />
                        Les bases de données sont protégées par les dispositions de la loi du 1er juillet 1998 transposant la directive 96/9 du 11 mars 1996 relative à la protection juridique des bases de données.
                    </DialogContentText>                

                    <DialogTitle>8. Liens hypertextes et cookies.</DialogTitle>
                    <DialogContentText>
                        Le site <a href="/">{websiteName}</a> contient un certain nombre de liens hypertextes vers d’autres sites, mis en place avec l’autorisation de Thomas SHELBY. Cependant, Thomas SHELBY n’a pas la possibilité de vérifier le contenu des sites ainsi visités, et n’assumera en conséquence aucune responsabilité de ce fait.<br />
                        La navigation sur le site <a href="/">{websiteName}</a> est susceptible de provoquer l’installation de cookie(s) sur l’ordinateur de l’utilisateur. Un cookie est un fichier de petite taille, qui ne permet pas l’identification de l’utilisateur, mais qui enregistre des informations relatives à la navigation d’un ordinateur sur un site. Les données ainsi obtenues visent à faciliter la navigation ultérieure sur le site, et ont également vocation à permettre diverses mesures de fréquentation.<br />
                        Le refus d’installation d’un cookie peut entraîner l’impossibilité d’accéder à certains services. L’utilisateur peut toutefois configurer son ordinateur de la manière suivante, pour refuser l’installation des cookies :<br />
                        <strong>Sous Internet Explorer</strong> : onglet outil (pictogramme en forme de rouage en haut a droite) / options internet. Cliquez sur Confidentialité et choisissez Bloquer tous les cookies. Validez sur Ok.<br />
                        <strong>Sous Firefox</strong> : en haut de la fenêtre du navigateur, cliquez sur le bouton Firefox, puis aller dans l'onglet Options. Cliquer sur l'onglet Vie privée.
                            Paramétrez les Règles de conservation sur :  utiliser les paramètres personnalisés pour l'historique. Enfin décochez-la pour  désactiver les cookies.<br />
                        <strong>Sous Safari</strong> : Cliquez en haut à droite du navigateur sur le pictogramme de menu (symbolisé par un rouage). Sélectionnez Paramètres. Cliquez sur Afficher les paramètres avancés. Dans la section "Confidentialité", cliquez sur Paramètres de contenu. Dans la section "Cookies", vous pouvez bloquer les cookies.<br />
                        <strong>Sous Chrome</strong> : Cliquez en haut à droite du navigateur sur le pictogramme de menu (symbolisé par trois lignes horizontales). Sélectionnez Paramètres. Cliquez sur Afficher les paramètres avancés. Dans la section "Confidentialité", cliquez sur préférences.  Dans l'onglet "Confidentialité", vous pouvez bloquer les cookies.<br />
                    </DialogContentText>                
                
                    <DialogTitle>9. Droit applicable et attribution de juridiction.</DialogTitle>
                    <DialogContentText>
                        Tout litige en relation avec l’utilisation du site <a href="/">{websiteName}</a> est soumis au droit français. Il est fait attribution exclusive de juridiction aux tribunaux compétents de Paris.
                    </DialogContentText>                
                
                    <DialogTitle>10. Les principales lois concernées.</DialogTitle>
                    <DialogContentText>
                        Loi n° 78-17 du 6 janvier 1978, notamment modifiée par la loi n° 2004-801 du 6 août 2004 relative à l'informatique, aux fichiers et aux libertés.<br />
                        Loi n° 2004-575 du 21 juin 2004 pour la confiance dans l'économie numérique.
                    </DialogContentText>                
                    
                    <DialogTitle>11. Lexique.</DialogTitle>
                    <DialogContentText>
                        <strong>Utilisateur</strong> : Internaute se connectant, utilisant le site susnommé.<br />
                        <strong>Informations personnelles</strong> : « les informations qui permettent, sous quelque forme que ce soit, directement ou non, l'identification des personnes physiques auxquelles elles s'appliquent » (article 4 de la loi n° 78-17 du 6 janvier 1978).
                    </DialogContentText>                
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Ok
                        </Button>
                </DialogActions>
            </Dialog>
        </div >
    );
}