import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Button, Image, Modal, ModalBody, ModalContent, ModalFooter, useDisclosure } from "@nextui-org/react"
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
import { useUpdateComment } from "@/lib/react-query/queriesAndMutations"
import toast from "react-hot-toast"


interface IIUpdateComment {
  comment?: Models.Document, 
  postId: string, 
  action?: 'Create' | 'Update', 
  closeParentPopover?: () => void
}

function UpdateComment({comment, action}: IIUpdateComment) {

    const {mutateAsync: updateComment, isPending} = useUpdateComment()
    const {isOpen, onOpen, onOpenChange} = useDisclosure();

    const form = useForm<z.infer<typeof CommentValidation>>({
        resolver: zodResolver(CommentValidation),
        defaultValues: {
            comment: comment ? comment.comment : "",
            file: comment ? [comment.imageUrl] : []
        },
    })
    
    async function onSubmit(values: z.infer<typeof CommentValidation>) {

        const newComment = await updateComment({
            ...values,
            commentId: comment?.$id
        })

        if (!newComment) return toast.error("Comment could not be updated, please try again.")

        if (newComment) {
            form.reset()
            toast.success("Comment Updated successfully.")
            onOpenChange()
        }
    }

    return (
      <>
      <Button color="secondary"
        onPress={onOpen}
        className="bg-dark-3 border-none rounded-full"
        isIconOnly
        startContent={
          <Image
            src="/assets/icons/edit.svg"
            width={16}
            height={16}
          />
        }
      >
        {/* Edit Comment */}
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
                          <Textarea className="shad-comment-textarea h-48 bg-[#222] custom-scrollbar" 
                            placeholder="Say something about this post" {...field} />
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

export default UpdateComment