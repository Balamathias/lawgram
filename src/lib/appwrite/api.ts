import { INewPost, INewUser, IUpdatePost, IUpdateUser } from "@/types"
import { account, appwriteConfig, avatars, databases, storage } from "./config"
import { ID, Query } from "appwrite"
import { URL } from "url"

export async function createUserAccount(user: INewUser) {
    try {
        const newAccount = await account.create(
            ID.unique(),
            user.email,
            user.password,
            user.username,
        )
        if (!newAccount) throw Error
        
        const avatar = avatars.getInitials(user.username)
        const newUser = await saveUserToDB({
            accountId: newAccount.$id,
            name: user.name,
            email: newAccount.email,
            username: newAccount.name,
            profileImage: avatar,
        })
        return newUser
    } catch (error) {
        console.log(error)
        return error
    }
}

export async function saveUserToDB(user: {
    accountId: string,
    name: string,
    email: string,
    username?: string,
    profileImage: URL
}) {
    try {
        const newUser = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            ID.unique(),
            user,
        )
        return newUser
    } catch (error) {
        console.log(error)
        return error
    }
}

export async function SignInAccount(user: { email: string, password: string}) {
    try{
        const session = await account.createEmailSession(user.email, user.password)
        return session
    } catch(error) {
        console.log(error)
    }
}

export async function getCurrentUser() {
    try {
        const currentUser = await account.get()

        if (!currentUser) throw new Error

        const currentAccount = databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            [Query.equal('accountId', currentUser.$id)]
        )

        if (!currentAccount) throw new Error

        const user = (await currentAccount).documents.at(0)

        return user
    } catch (error) {
        console.log(error)
    }
}

export async function signOutAccount() {
    try {
        const session = account.deleteSession('current')
        return session
    } catch (error) {
        console.log(error)
        return error
    }
}

export async function createPost(post: INewPost) {
    try {

        const uploadedFile = uploadFile(post.file[0])
        if (!uploadedFile) throw Error

        const fileUrl = await getFilePreview((await uploadedFile).$id)

        if (!fileUrl) {
            deleteFile((await uploadedFile).$id)
            throw Error
        }

        const tags = post.tags?.replace(/ /g, '').toLowerCase().split(',') || []

        const newPost = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.postsCollectionId,
            ID.unique(),
            {
                creator: post.userId,
                caption: post.caption,
                tags: tags,
                imageUrl: fileUrl,
                imageId: (await uploadedFile).$id,
                location: post.location
                
            }
        )

        if (!newPost) {
            deleteFile((await uploadedFile).$id)
            throw Error
        }

        return newPost
    } catch (error) {
        console.log(error)
        return error
    }
}

export async function uploadFile(file: File) {
    const promise = await storage.createFile(
        appwriteConfig.storageId,
        ID.unique(),
        file,
    )

    return promise
}

export async function getFilePreview(filedId: string): Promise<URL> {
    try {
        const previewUrl = await storage.getFilePreview(
            appwriteConfig.storageId,
            filedId,
            2000,
            2000,
            'top',
            100
        )

        if (!previewUrl) throw Error

        return previewUrl
    } catch (error: any) {
        console.log(error)
        return error
    }
}

export async function deleteFile(filedId: string) {
    try {
        const deleteFile = await storage.deleteFile(appwriteConfig.storageId, filedId)
        return deleteFile
    } catch (error) {
        console.log(error)
    }
}

export async function getRecentPosts() {
    try {
        const posts = databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.postsCollectionId,
            [Query.orderDesc('$createdAt'), Query.limit(20)]
        )

        if (!posts) throw Error

        return posts
    } catch (error) {
        console.log(error)
    }
}

export async function getInfiniteRecentPosts({pageParam}: {pageParam: number}) {
    const queries: any[] = [Query.orderDesc('$createdAt'), Query.limit(5)]

    if (pageParam) {
        queries.push(Query.cursorAfter(pageParam.toString()))
    }

    try {
        const posts = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.postsCollectionId,
            queries
        )
        if (!posts) throw Error
        return posts
    } catch (error) {
        console.log(error)
    }
}

export async function likePost(postId: string, likesArray: string[]) {
    try {
        const updatedPost = await databases.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.postsCollectionId,
            postId,
            {
                likes: likesArray
            }
        )
        if (!updatedPost) throw Error
        return updatedPost
    } catch (error) {
        console.log(error)
    }
}

export async function savePost(postId: string, userId: string) {
    try {
        const updatedPost = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.savesCollectionId,
            ID.unique(),
            {
                user: userId,
                post: postId
            }
        )
        if (!updatedPost) throw Error
        return updatedPost
    } catch (error) {
        console.log(error)
    }
}

export async function deleteSavedPost(recordId: string) {
    try {
        const statusCode = await databases.deleteDocument(
            appwriteConfig.databaseId,
            appwriteConfig.savesCollectionId,
            recordId
        )

        if (!statusCode) throw Error

        return {status: "ok", code: 200}
    } catch (error) {
        console.log(error)
    }
}

export async function getSavedPosts(userId: string) {
    try {
        const posts = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.savesCollectionId,
            [Query.equal('user', userId)]
        )
        if (!posts) throw Error

        return posts
    } catch (error) {
        console.log(error)
    }
}

export async function getPostById(postId: string) {
    try {
        const post = await databases.getDocument(
            appwriteConfig.databaseId,
            appwriteConfig.postsCollectionId,
            postId
        )
        if (!post) throw Error

        return post
    } catch (error) {
      console.log(error)  
    }
}

export async function updatePost(post: IUpdatePost) {
    const hasFileToUpload = post.file.length > 1
    try {
        let image = {
            imageUrl: post.imageUrl,
            imageId: post.imageId
        }

        if (hasFileToUpload) {
            const uploadedFile = uploadFile(post.file[0])
            if (!uploadedFile) throw Error
            const fileUrl:URL = await getFilePreview((await uploadedFile).$id)
    
            if (!fileUrl) {
                deleteFile((await uploadedFile).$id)
                throw Error
            }
            image = {...image, imageUrl: fileUrl, imageId: (await uploadedFile).$id }
        }



        const tags = post.tags?.replace(/ /g, '').toLowerCase().split(',') || []

        const updatedPost = await databases.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.postsCollectionId,
            post.postId,
            {
                caption: post.caption,
                tags: tags,
                imageUrl: image.imageUrl,
                imageId: image.imageId,
                location: post.location
                
            }
        )

        if (!updatedPost) {
            deleteFile(post.imageId)
            throw Error
        }

        return updatedPost
    } catch (error) {
        console.log(error)
        return error
    }
}

export async function deletePost(postId: string, imageId: string) {
    if (!postId || !imageId) throw Error
    try {
        const status = await databases.deleteDocument(
            appwriteConfig.databaseId,
            appwriteConfig.postsCollectionId,
            postId
        )
        if (!status) throw Error
        return {status: "ok"}
    } catch (error) {
        console.log(error)
    }
}

export async function getInfinitePosts({pageParam}: {pageParam: number}) {
    const queries: any[] = [Query.orderDesc('$updatedAt'), Query.limit(6)]

    if (pageParam) {
        queries.push(Query.cursorAfter(pageParam.toString()))
    }

    try {
        const posts = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.postsCollectionId,
            queries
        )
        if (!posts) throw Error
        return posts
    } catch (error: any) {
        console.log(error)
        return error
    }
}

export async function getUserPosts(userId: string) {
    const queries: any[] = [Query.equal('creator', userId), Query.orderDesc('$createdAt'), Query.limit(10)]

    try {
        const posts = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.postsCollectionId,
            queries
        )
        if (!posts) throw Error
        return posts
    } catch (error) {
        console.log(error)
    }
}

export async function searchPosts(searchTerm: string) {
    try {
        const posts = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.postsCollectionId,
            [Query.search('caption', searchTerm)]
        )
        if (!posts) throw Error
        return posts
    } catch (error) {
        console.log(error)
    }
}

export async function getPostsByTag(tag: string) {
    try {
        const posts = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.postsCollectionId,
            [Query.select([tag]), Query.orderDesc('$createdAt'), Query.orderDesc('$updatedAt')]
        )
        if (!posts) throw Error
        return posts
    } catch (error) {
        console.log(error)
    }
}

export async function getInfiniteUsers({ pageParam }: {pageParam?: number}) {
    const queries = [Query.limit(10)];
  
    if (pageParam) {
      queries.push(Query.cursorAfter(pageParam.toString()));
    }
  
    try {
      const users = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.userCollectionId,
        queries
      );
  
      if (!users) throw Error;
  
      return users;
    } catch (error) {
      console.log(error);
    }
  }

export async function getUserById(userId: string) {  
    try {
      const user = await databases.getDocument(
        appwriteConfig.databaseId,
        appwriteConfig.userCollectionId,
        userId
      );
  
      if (!user) throw Error;
  
      return user;
    } catch (error) {
      console.log(error);
    }
  }

  export async function updateUser(user: IUpdateUser) {
    try {
        const hasFileToUpload = user.file.length > 0;
        let image = {
            profileImage: user.profileImage,
            imageId: user.imageId,
        };

        if (hasFileToUpload) {
            const uploadedFile = await uploadFile(user.file[0]);
            if (!uploadedFile) {
                throw new Error("File upload failed");
            }
            
            const fileUrl = await getFilePreview(uploadedFile.$id);

            if (!fileUrl) {
                deleteFile(uploadedFile.$id);
                throw new Error("File URL retrieval failed");
            }
            
            image = {
                ...image,
                profileImage: fileUrl,
                imageId: uploadedFile.$id,
            };
        }

        const updatedUser = await databases.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            user.userId,
            {
                name: user.name,
                profileImage: image.profileImage,
                bio: user.bio,
            }
        );

        if (!updatedUser) {
            deleteFile(user.userId);
            throw new Error("User update failed");
        }

        return updatedUser;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

