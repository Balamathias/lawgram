import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { Textarea } from "./ui/textarea"
import { Models } from "appwrite"
import { CommentValidation } from "@/lib/validations"
import { useUserAuth } from "@/context/AuthContext"
import { useCreateComment } from "@/lib/react-query/queriesAndMutations"
import Loader from "@/lib/shared/Loader"
import toast from "react-hot-toast"


function CommentForm({comment, postId, action}:{comment?: Models.Document, postId: string, action?: 'Create' | 'Update'}) {

    const { user } = useUserAuth()
    const {mutateAsync: createComment, isPending} = useCreateComment()
    // const {mutateAsync: updatePost, isPending: isPendingUpdate} = useUpdatePost()

    const form = useForm<z.infer<typeof CommentValidation>>({
        resolver: zodResolver(CommentValidation),
        defaultValues: {
            comment: comment ? comment.comment : "",
            file: comment ? [comment.imageUrl] : []
        },
    })
    
    async function onSubmit(values: z.infer<typeof CommentValidation>) {

        // if (post && action === 'Update') {
        //   const updatedPost = await updatePost({
        //     ...values,
        //     imageUrl: post.imageUrl,
        //     postId: post.$id,
        //     imageId: post?.imageId,
        // })

        // if (!updatedPost) return toast({description: "Post could not be updated, please try again."})

        // return navigate(`/posts/${post.$id}`)

        // }

        const newComment = await createComment({
            ...values,
            user: user?.id,
            post: postId
        })

        console.log(newComment)

        if (!newComment) return toast.error("Comment could not be added, please try again.")

        if (newComment) {
            form.reset()
            toast.success("Comment Posted successfully.")
        }
    }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col max-w-5xl w-full gap-4">
        <FormField
          control={form.control}
          name="comment"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea className="shad-comment-textarea custom-scrollbar" placeholder="Say something about this post" {...field} />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />
        <Button type="submit" className="bg-primary-600 w-fit shad-button whitespace-nowrap">
            {isPending ? (
                <div className="flex gap-3 items-center">
                    <Loader />
                    <span>{action === 'Update' ? 'Updating...' : "Posting..."}</span>
                </div>
            ) : action === 'Update' ? "Update" : "Post"}
        </Button>
      </form>
    </Form>
  )
}

export default CommentForm