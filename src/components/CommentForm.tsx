import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Button, Modal, ModalBody, ModalContent, ModalFooter, useDisclosure } from "@nextui-org/react"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Textarea } from "./ui/textarea"
import { Models } from "appwrite"
import { CommentValidation } from "@/lib/validations"
import { useUserAuth } from "@/context/AuthContext"
import { useCreateComment } from "@/lib/react-query/queriesAndMutations"
import toast from "react-hot-toast"


function CommentForm({comment, postId, action}:{comment?: Models.Document, postId: string, action?: 'Create' | 'Update'}) {

    const { user } = useUserAuth()
    const {mutateAsync: createComment, isPending} = useCreateComment()
    const {isOpen, onOpen, onOpenChange} = useDisclosure();

    const form = useForm<z.infer<typeof CommentValidation>>({
        resolver: zodResolver(CommentValidation),
        defaultValues: {
            comment: comment ? comment.comment : "",
            file: comment ? [comment.imageUrl] : []
        },
    })
    
    async function onSubmit(values: z.infer<typeof CommentValidation>) {

        const newComment = await createComment({
            ...values,
            user: user?.id,
            post: postId
        })

        console.log(newComment)

        if (!newComment) return toast?.error("Comment could not be added, please try again.")

        if (newComment) {
            form?.reset()
            toast?.success("Comment Posted successfully.")
            onOpenChange()
        }
    }

  return (
    <>
    <Button onPress={onOpen} color="primary" variant="bordered">
      Post a Comment
    </Button>
    <Modal 
        isOpen={isOpen} 
        onOpenChange={onOpenChange}
        placement="center"
        backdrop="opaque"
      >
        <ModalContent className="bg-dark-2 p-4 shadow-2xl border border-dark-4">
          {(onClose) => (
            <>
            <ModalBody>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col py-2 max-w-5xl w-full gap-4">
                <FormField
                  control={form.control}
                  name="comment"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="hidden">Add comment</FormLabel>
                      <FormControl>
                        <Textarea className="shad-comment-textarea bg-[#222] custom-scrollbar" placeholder="Say something about this post" {...field} />
                      </FormControl>
                      <FormMessage className="shad-form_message" />
                    </FormItem>
                  )}
                />
                <div className="flex justify-end">
                </div>
                <ModalFooter>
                  <Button color="danger" variant="flat" onPress={onClose} className="rounded-[50px]">
                    Close
                  </Button>
                  <Button type="submit"
                    isLoading={isPending} 
                    className="bg-primary-600 text-slate-50 whitespace-nowrap rounded-[50px]">
                      {isPending ? (
                          <span>{action === 'Update' ? 'Updating...' : "Posting..."}</span>
                      ) : action === 'Update' ? <span>Update</span> : <span>Post</span>}
                  </Button>
                </ModalFooter>
              </form>
            </Form>
            </ModalBody>
            </>
          )}
        </ModalContent>
    </Modal>
    </>
  )
}

export default CommentForm