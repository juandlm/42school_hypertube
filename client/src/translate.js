import React from 'react';

const ReactLanguage = require('react-language');
const En = ReactLanguage.create('en');
const Fr = ReactLanguage.create('fr');

export const settingsTranslate = (param) => {
    if (param === 'title')
        return (translate('Settings', 'Paramètres'))
    if (param === 'lang')
        return (translate('Language', 'Langue'))
    if (param === 'en')
        return (translate('English', 'Anglais'))
    if (param === 'fr')
        return (translate('French', 'Français'))
    if (param === 'firstName')
        return (translate('First name', 'Prénom'))
    if (param === 'lastName')
        return (translate('Last name', 'Nom'))
    if (param === 'newPwd')
        return (translate('New password', 'Nouveau mot de passe'))
    if (param === 'pwd')
        return (translate('Password', 'Mot de passe'))
    if (param === 'confPwd')
        return (translate('Password confirmation', 'Confirmation du mot de passe'))
    if (param === 'modifPwd')
        return (translate('Change password', 'Modifier mot de passe'))
    if (param === 'cancel')
        return (translate('Cancel', 'Annuler'))
    if (param === 'ok')
        return (translate('Confirm', 'Confirmer'))
}

export const navbarTranslate = (param) => {
    if (param === 'theme')
        return (translate('Toggle light/dark theme', 'Changer theme clair/sombre'))
    if (param === 'profile')
        return (translate('Profile', 'Profil'))
    if (param === 'settings')
        return (translate('Settings', 'Paramètres'))
    if (param === 'logout')
        return (translate('Logout', 'Déconnexion'))
}

export const userTranslate = (param) => {
    if (param === 'username')
        return (translate('Username', "Nom d'utilisateur"))
    if (param === 'name')
        return (translate('Full name', 'Nom complet'))
    if (param === 'lastMovies')
        return (translate('Last movies seen', 'Derniers films vus'))
}

export const listFilterTranslate = (param) => {
    if (param === 'adventure')
        return (translate('Adventure', 'Aventure'))
    if (param === 'documentary')
        return (translate('Documentary', 'Documentaire'))
    if (param === 'drama')
        return (translate('Drama', 'Drame'))
    if (param === 'drama')
        return (translate('Drama', 'Drame'))
    if (param === 'history')
        return (translate('History', 'Histoire'))
    if (param === 'horror')
        return (translate('Horror', 'Epouvante'))
    if (param === 'war')
        return (translate('War', 'Guerre'))
    if (param === 'sort')
        return (translate('Sort', 'Trier'))
    if (param === 'date')
        return (translate('Release date', 'Date de sortie'))
    if (param === 'title')
        return (translate('Title', 'Titre'))
    if (param === 'rating')
        return (translate('Rating', 'Note'))
    if (param === 'imdb')
        return (translate('IMDB Rating', 'Note IMDB'))
    if (param === 'none')
        return (translate('None', 'Aucun'))
    if (param === 'filter')
        return (translate('Filters & sorts', 'Filtes & tris'))
}

export const trailerTranslate = (param) => {
    if (param === 'rating')
        return (translate('Rating', 'Note'))
    if (param === 'seeMovie')
        return (translate('Watch the movie', 'Voir le film'))
}

export const alertTranslate = (param) => {
    if (param === 'infoSuccess')
        return (translate('Information changed successfully', 'Informations modifiés avec succès'))
    if (param === 'infoError')
        return (translate('Changing your information failed', 'La modification de vos informations a échoué'))
    if (param === 'infoIndisp')
        return (translate('This user or email are unavailable', 'Cet utilisateur ou cette email sont indisponibles'))
}

export const movieViewTranslate = (param) => {
    if (param === 'comments')
        return (translate('Comments', 'Commentaires'))
    if (param === 'post')
        return (translate('Post', 'Poster'))
}

const translate = (englishText, frenchText) => {
    return (
        <span>
            <En>{englishText}</En>
            <Fr>{frenchText}</Fr>
        </span>
    )
}