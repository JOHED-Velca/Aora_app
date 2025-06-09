import { Account, Avatars, Client, Databases, ID, Query } from 'react-native-appwrite';

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

//this allows us to expose them outside the object
const {
    endpoint,
    platform,
    projectId,
    databaseId,
    userCollectionId,
    videoCollectionId,
    storageId,
} = config;


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

        await signIn(email, password);

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

export const signIn = async (email, password) => {
    // try {
    //     const session = await account.createEmailPasswordSession(email, password);

    //     return session;
    // } catch (error) {
    //     console.log(error);
    //     throw new Error(error);
    // }

    try {
        // Log out any existing session
        try {
            await account.deleteSession('current');
        } catch (logoutError) {
            // Ignore if no session exists
        }

        const session = await account.createEmailPasswordSession(email, password);
        if (!session) throw new Error('Session creation failed');
        return session;
    } catch (error) {
        console.log(error);
        throw new Error(error.message);
    }
}

export const getCurrentUser = async () => {
    try {
        const currentAccount = await account.get();
        if (!currentAccount) throw Error;

        const currentUser = await databases.listDocuments(
            config.databaseId,
            config.userCollectionId,
            [Query.equal('accountId', currentAccount.$id)]
        )

        if(!currentAccount) throw Error;

        return currentUser.documents[0];
    } catch (error) {
        
    }
}

export const getAllPosts = async () => {
    try {
        const posts = await databases.listDocuments(
            databaseId,
            videoCollectionId
        )

        return posts.documents;
    } catch (error) {
        console.log(error);
        throw new Error(error);
        
    }
}

export const getLatestPosts = async () => {
    try {
        const posts = await databases.listDocuments(
            databaseId,
            videoCollectionId,
            [Query.orderDesc('$createdAt'), Query.limit(7)]
        )

        return posts.documents;
    } catch (error) {
        console.log(error);
        throw new Error(error);
        
    }
}

export const searchPosts = async (query) => {
    try {
        const posts = await databases.listDocuments(
            databaseId,
            videoCollectionId,
            [Query.search('title', query)]
        )

        return posts.documents;
    } catch (error) {
        console.log(error);
        throw new Error(error);
        
    }
}