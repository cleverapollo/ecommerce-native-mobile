import { ContentCreatorAccount } from "@core/models/content-creator.model";
import { AuthProvider } from "@core/models/signup.model";
import { EmailDto, EmailVerificationStatus, UserProfile, UserSettingsDto } from "@core/models/user.model";

export const creatorMax: ContentCreatorAccount = {
    name: 'Max Mustermann',
    userName: 'max',
    description: 'Überall dieselbe alte Leier. Das Layout ist fertig, der Text lässt auf sich warten. Damit das Layout nun nicht nackt im Raume steht und sich klein und leer vorkommt, springe ich ein: der Blindtext. Genau zu diesem Zwecke erschaffen, immer im Schatten meines großen Bruders »Lorem Ipsum«, freue ich mich',
    socialMediaLinks: {
        instagramUrl: 'https://www.instagram.com/knossi',
        facebookUrl: 'https://de-de.facebook.com/knossi/',
        youtubeUrl: 'https://www.youtube.com/channel/UCtckLvYloMnsey8E5qTwWwA',
        tiktokUrl: 'https://www.tiktok.com/@therealknossi'
    }
}

export const userMax: UserProfile = {
    authProvider: AuthProvider.WANTIC,
    email: new EmailDto('max@wantic.io', EmailVerificationStatus.VERIFIED),
    firstName: 'Max',
    lastName: 'Mustermann',
    userSettings: new UserSettingsDto(true, false),
    birthday: new Date(1990, 5, 12),
    creatorAccount: creatorMax
}