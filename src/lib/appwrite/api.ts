import { INewComment, INewPost, INewUser, IUpdateComment, IUpdatePost, IUpdateUser } from "@/types"
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

export async function SignUpOAuthAccount() {
    try{        
        const session = await account.get();
        
        const name = session?.name
        const email = session?.email
        const userId = session?.$id
        
        account.createOAuth2Session('google', 'https://lawgram.vercel.app', 'https://lawgram.vercel.app/sign-up');
        
        await new Promise((resolve: any) => {
            setTimeout(() => {
                saveOAuthUser({$id: userId, name, email})
                resolve();
            }, 3000)
        })

        if (!session) 
            throw new Error('User could not be created');
    } catch(error) {
        console.log(error)
    }
}

export async function saveOAuthUser(newAccount: {
    $id: string,
    name: string,
    email: string
}) {

    const userExists = await getUserById(newAccount.$id)

    if (userExists?.$id) throw new Error("User already exists in database.")
    
    const avatar = avatars.getInitials(newAccount.name)
    const newUser = await saveUserToDB({
        accountId: newAccount.$id,
        name: newAccount.name,
        email: newAccount.email,
        username: '',
        profileImage: avatar,
    })
    return newUser
}

export async function SignInOAuthAccount() {
    try{
        const session = account.createOAuth2Session('google', 'https://lawgram.vercel.app', 'https://lawgram.vercel.app/sign-in')
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

        if (!currentAccount ) throw Error

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
    if (!post.userId) throw new Error('A post must have a user attached to it.')
    try {
        let uploadedFile
        let fileUrl: URL | null = null

        if (post?.file?.length > 0) {
            uploadedFile = uploadFile(post?.file?.at(0)) || null
            if (!uploadedFile) throw new Error("File upload failed")
            fileUrl = await getFilePreview((await uploadedFile).$id)

            if (!fileUrl) {
                uploadedFile && deleteFile((await uploadedFile).$id)
                throw new Error("File preview generation failed")
            }
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
                imageId: uploadedFile ? (await uploadedFile)?.$id : null,
                location: post.location
            }
        )

        if (!newPost) {
            uploadedFile && deleteFile((await uploadedFile)?.$id)
            throw new Error("Post creation failed")
        }

        return newPost
    } catch (error) {
        console.error(error)
        return error
    }
}

export async function uploadFile(file: File | undefined) {
    if (!file) throw new Error("No file was provided for upload.")
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

/** Redundant */
export async function getUserLikedPosts(userId: string) {
    try {
        const posts = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            [Query.equal('user', userId)]
        )
        if (!posts) throw Error

        return posts
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
            deleteFile(image.imageId)
            throw Error
        }

        return updatedPost
    } catch (error) {
        console.log(error)
        return error
    }
}

export async function deletePost(postId: string, imageId?: string) {
    if (!postId && !imageId) throw Error
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
  
      if (!user) throw new Error(`User with the ID ${userId} could not be found.`)
  
      return user;
    } catch (error) {
      try {
        const user_by_username = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            [Query.equal('username', userId)]
            )

        if (!user_by_username) throw new Error(`User with the username ${userId}, could not be found.`)

        return user_by_username.documents.at(0)
      } catch (error) {
        console.error(error)
      }
    }
  }

export async function updateUser(user: IUpdateUser) {
    const hasFileToUpload = user.file.length > 0 && (typeof user?.file !== 'string')
    console.log(hasFileToUpload, user?.file)
    try {
        let image = {
            profileImage: user.profileImage,
            imageId: user?.imageId
        }

        if (hasFileToUpload) {
            const uploadedFile = uploadFile(user.file.at(0))
            if (!uploadedFile) throw Error
            const fileUrl:URL = await getFilePreview((await uploadedFile).$id)
    
            if (!fileUrl) {
                deleteFile((await uploadedFile).$id)
                throw Error
            }
            image = {...image, profileImage: fileUrl, imageId: (await uploadedFile).$id }
        }

        const updatedUser = await databases.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            user.userId,
            {
                name: user.name,
                bio: user.bio,
                profileImage: image.profileImage
                
            }
        )

        if (!updatedUser) {
            deleteFile(image.imageId)
            throw Error
        }

        return updatedUser
    } catch (error) {
        console.log(error)
        return error
    }
}

export async function addPostComment(comment: INewComment) {
    try {
        let uploadedFile
        let fileUrl: URL | null = null
        let newComment = {}

        if (comment?.file?.length > 0) {
            uploadedFile = uploadFile(comment?.file?.at(0)) || null
            if (!uploadedFile) throw Error
            fileUrl = await getFilePreview((await uploadedFile).$id)
    
            if (!fileUrl) {
                deleteFile((await uploadedFile).$id)
                throw Error
            }
        }

        newComment = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.commentsCollectionId,
            ID.unique(),
            {
                post: comment.post,
                user: comment.user,
                comment: comment.comment,
                imageUrl: fileUrl,
                imageId: uploadedFile ? (await uploadedFile)?.$id : null,                    
            }
        )

        if (!newComment) {
            uploadedFile ? deleteFile((await uploadedFile)?.$id) : null
            throw Error
        }

        return newComment
    } catch (error) {
        console.log(error)
        return error
    }
}

export async function updatePostComment(comment: IUpdateComment) {
    try {
        let uploadedFile
        let fileUrl: URL | null = null
        let newComment = {}
        const hasFileToUpload = comment?.file?.length > 1 && typeof comment?.file !== 'string'
        
        if (hasFileToUpload) {
            uploadedFile = uploadFile(comment?.file?.at(0)) || null
            if (!uploadedFile) throw Error
            fileUrl = await getFilePreview((await uploadedFile).$id)
            
            if (!fileUrl) {
                deleteFile((await uploadedFile).$id)
                throw Error
            }
        }
        console.log(hasFileToUpload, comment?.file)

        newComment = await databases.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.commentsCollectionId,
            comment?.commentId || '',
            {
                comment: comment.comment,
                imageUrl: fileUrl ?? comment.imageUrl,
                imageId: uploadedFile ? (await uploadedFile)?.$id : null,                    
            }
        )

        if (!newComment) {
            uploadedFile ? deleteFile((await uploadedFile)?.$id) : null
            throw Error
        }

        return newComment
    } catch (error) {
        console.log(error)
        return error
    }
}

export async function getPostComments(postId: string) {
    const queries = [Query.equal("post", postId), Query.orderDesc('$createdAt')]
    try {
      const comments = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.commentsCollectionId,
        queries
      );
  
      if (!comments) throw Error;
  
      return comments;
    } catch (error) {
      console.log(error);
    }
  }

  export async function likeComment(commentId: string, likesArray: string[]) {
    try {
        const updatedComment = await databases.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.commentsCollectionId,
            commentId,
            {
                likes: likesArray
            }
        )
        if (!updatedComment) throw Error
        return updatedComment
    } catch (error) {
        console.log(error)
    }
}

export async function deleteComment(commentId: string, imageId?: string) {
    if (!commentId && !imageId) throw Error
    try {
        const status = await databases.deleteDocument(
            appwriteConfig.databaseId,
            appwriteConfig.commentsCollectionId,
            commentId
        )
        if (!status) throw Error
        return {status: "ok", commentId}
    } catch (error) {
        console.log(error)
    }
}

