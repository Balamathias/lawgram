import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "./ui/textarea"
import FileUploader from "@/lib/shared/FileUploader"
import { Models } from "appwrite"
import { PostValidation } from "@/lib/validations"
import { useUserAuth } from "@/context/AuthContext"
import { useCreatePost, useUpdatePost } from "@/lib/react-query/queriesAndMutations"
import { useNavigate } from "react-router-dom"
import Loader from "@/lib/shared/Loader"
import toast from "react-hot-toast"


function PostForm({post, action}:{post?: Models.Document, action?: 'Create' | 'Update'}) {

    const { user } = useUserAuth()
    const {mutateAsync: createPost, isPending} = useCreatePost()
    const {mutateAsync: updatePost, isPending: isPendingUpdate} = useUpdatePost()
    const navigate = useNavigate()

    const form = useForm<z.infer<typeof PostValidation>>({
        resolver: zodResolver(PostValidation),
        defaultValues: {
            caption: post ? post.caption : "",
            file: post ? [post.imageUrl] : [],
            location: post ? post.location : "",
            tags: post ? post.tags.join(',') : ""
        },
    })
    
    async function onSubmit(values: z.infer<typeof PostValidation>) {

        if (post && action === 'Update') {
          const updatedPost = await updatePost({
            ...values,
            imageUrl: post.imageUrl,
            postId: post.$id,
            imageId: post?.imageId,
        })

        if (!updatedPost) return toast.error("Post could not be updated, please try again.")

        toast.success("Post Updated successfully.")

        return navigate(`/posts/${post.$id}`)

        }

        const newPost = await createPost({
            ...values,
            userId: user.id
        })

        if (!newPost) return toast.error("Post could not be created, please try again.")

        if (newPost) {
            form.reset()
            toast.success("Post added Successfully.")
            navigate('/')
        }
    }

    return (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col max-w-5xl w-full gap-9">
            <FormField
              control={form.control}
              name="caption"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="shad-form_label">Caption</FormLabel>
                  <FormControl>
                    <Textarea className="shad-textarea custom-scrollbar" placeholder="What is the legal matter on your mind?" {...field} />
                  </FormControl>
                  <FormMessage className="shad-form_message" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="file"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="shad-form_label">Add Photos</FormLabel>
                  <FormControl>
                    <FileUploader fieldChange={field?.onChange} mediaUrl={post?.imageUrl} />
                  </FormControl>
                  <FormMessage className="shad-form_message" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="shad-form_label">Add Location</FormLabel>
                  <FormControl>
                    <Input className="shad-input" {...field} />
                  </FormControl>
                  <FormMessage className="shad-form_message" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="shad-form_label">Add tags seperated with a Comma as this ",".</FormLabel>
                  <FormControl>
                    <Input className="shad-input" placeholder="Contract, BlockChain, Defi, Evidence" {...field} />
                  </FormControl>
                  <FormMessage className="shad-form_message" />
                </FormItem>
              )}
            />
            <div className="flex items-center justify-end gap-4">
                <Button type="button" className="shad-button_dark_4">Cancel</Button>
                <Button type="submit" className="bg-primary-600 shad-button whitespace-nowrap">
                    {isPending || isPendingUpdate ? (
                        <div className="flex gap-3 items-center">
                            <Loader />
                            <span>{action === 'Update' ? 'Updating...' : "Posting..."}</span>
                        </div>
                    ) : action === 'Update' ? "Update" : "Post"}
                </Button>
            </div>
          </form>
        </Form>
      )
}

export default PostForm