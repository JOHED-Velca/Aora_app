import { Account, Avatars, Client, Databases, ID } from 'react-native-appwrite';

//create and export a new appwriteConfig object
export const config = {
    endpoint: 'https://cloud.appwrite.io/v1',
    platform: 'com.johed.aora',
    projectId: '683f6817000fd5b6b4c9',
    databaseId:'683f6a9f001b8afbc4b8',
    userCollectionId: '683f6af10034313dedba',
    videoCollectionId: '683f6b2b001e15e8ecaa',
    storageId: '683f6cba0005034c6ae7'
}


// Init your React Native SDK
const client = new Client();

client
    .setEndpoint(config.endpoint)
    .setProject(config.projectId)
    .setPlatform(config.platform)
;

const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);

// Register User
export const createUser = async (email, password, username) => {
    try {
        const newAccount = await account.create(
            ID.unique(),
            email,
            password,
            username
        )

        if(!newAccount) throw Error;

        const avatarUrl = avatars.getInitials(username)

        await SingIn(email, password);

        const newUser = await databases.createDocument(
            config.databaseId,
            config.userCollectionId,
            ID.unique(),
            {
                accountId: newAccount.$id,
                email,
                username,
                avatar: avatarUrl
            }
        )

        return newUser;
    } catch (error) {
        console.log(error);
        throw new Error(error);        
    }
}

export async function SingIn(email, password) {
    try {
        const session = await account.createEmailSession(email, password);
        if (!user) throw Error;

        return session;
    } catch (error) {
        console.log(error);
        throw new Error(error);
    }
}