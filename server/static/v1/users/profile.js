module.exports = {
    firstName: 'Max',
    lastName: 'Mustermann',
    birthday: new Date(1990, 7, 1),
    email: {
        value: 'mock@wantic.io',
        status: 'ACCEPTED'
    },
    imagePath: 'http://localhost:3000/download/knossi.jpg',
    authProvider: 'WANTIC',
    userSettings: {
        showOnboardingSlidesiOS: true,
        showOnboardingSlidesAndroid: false
    },
    creatorAccount: {
        name: 'Max Mustermann',
        userName: 'max90',
        description: 
        'Max "Maxi" Mustermann\n' + 
        'Person des fiktiven Lebens\n' + 
        '👑 Entertainer\n' + 
        '👑 Anfragen: max@wantic.io\n' +
        '👑 Socials & mehr:\n' +
        'https://wantic.io',
        socialMediaLinks: {
            instagramUrl: 'https://www.instagram.com/knossi',
            facebookUrl: 'https://de-de.facebook.com/knossi/',
            youtubeUrl: 'https://www.youtube.com/channel/UCtckLvYloMnsey8E5qTwWwA',
            tiktokUrl: 'https://www.tiktok.com/@therealknossi'
        }
    }
}