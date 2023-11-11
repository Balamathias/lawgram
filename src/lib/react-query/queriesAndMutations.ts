import {
    useQueryClient, 
    useQuery, 
    useMutation,
    useInfiniteQuery
} from '@tanstack/react-query'

import { SignInAccount, createPost, createUserAccount, deletePost, deleteSavedPost, getCurrentUser, getInfinitePosts, getPostById, getRecentPosts, likePost, savePost, searchPosts, signOutAccount, updatePost } from '../appwrite/api'
import { INewPost, INewUser, IUpdatePost } from '@/types'
import { QUERY_KEYS } from './queryKeys'

export const useCreateNewUser = () => {
    return useMutation({
        mutationFn: (user: INewUser) => createUserAccount(user),
        mutationKey: ['user']
    })
}

export const useSignIn = () => {
    return useMutation({
        mutationFn: ({email, password}: {email: string, password: string}) => SignInAccount({email, password}),
    })
}

export const useSignOut = () => {
    return useMutation({
        mutationFn: signOutAccount,
    })
}

export const useCreatePost = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (post: INewPost) => createPost(post),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_RECENT_POSTS]
            })
        }
    })
}

export const useGetRecentPosts = () => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
        queryFn: getRecentPosts
    })
}

export const useLikePost = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({postId, likesArray}: {postId: string, likesArray: string[]}) => likePost(postId, likesArray),
        onSuccess: (data) => {
            queryClient.invalidateQueries({queryKey: [QUERY_KEYS.GET_POST_BY_ID, data?.id]})
            queryClient.invalidateQueries({queryKey: [QUERY_KEYS.GET_RECENT_POSTS]})
            queryClient.invalidateQueries({queryKey: [QUERY_KEYS.GET_USER_BY_ID]})
            queryClient.invalidateQueries({queryKey: [QUERY_KEYS.GET_CURRENT_USER]})
        }
    })
}

export const useSavePost = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({postId, userId}: {postId: string, userId: string}) => savePost(postId, userId),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: [QUERY_KEYS.GET_RECENT_POSTS]})
            queryClient.invalidateQueries({queryKey: [QUERY_KEYS.GET_USER_BY_ID]})
            queryClient.invalidateQueries({queryKey: [QUERY_KEYS.GET_CURRENT_USER]})
        }
    })
}

export const useDeleteSavedPost = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (recordId: string) => deleteSavedPost(recordId),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: [QUERY_KEYS.GET_RECENT_POSTS]})
            queryClient.invalidateQueries({queryKey: [QUERY_KEYS.GET_USER_BY_ID]})
            queryClient.invalidateQueries({queryKey: [QUERY_KEYS.GET_CURRENT_USER]})
        }
    })
}

export const useGetCurrentUser = () => {
    return useQuery({
        queryFn: getCurrentUser,
        queryKey: [QUERY_KEYS.GET_CURRENT_USER]
    })
}

export const useGetPostById = (postId: string) => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_POST_BY_ID, postId],
        queryFn:() => getPostById(postId),
        enabled: !!postId
    })
}

export const useUpdatePost = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (post: IUpdatePost) => updatePost(post),
        onSuccess: (data) => {
            queryClient.invalidateQueries({queryKey: [QUERY_KEYS.GET_POST_BY_ID, data?.$id]})
        }
    })
}

export const useDeletePost = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({postId, imageId}: {postId: string, imageId: string}) => deletePost(postId, imageId),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: [QUERY_KEYS.GET_RECENT_POSTS]})
        }
    })
}

export const useGetPosts = () => {
    return useInfiniteQuery({
        queryKey: [QUERY_KEYS.GET_INFINITE_POSTS],
        queryFn: getInfinitePosts,
        getNextPageParam: (lastPage) => {
            if (lastPage && lastPage.documents.length === 0) return null
            const lastId = lastPage?.documents[lastPage.documents.length -1].$id
            return lastId
        }
    })
}

export const useSearchPosts = (searchTerm: string) => {
    return useQuery({
        queryKey: [QUERY_KEYS.SEARCH_POSTS, searchTerm],
        queryFn: () => searchPosts(searchTerm),
        enabled: !!searchTerm
    })
} 

