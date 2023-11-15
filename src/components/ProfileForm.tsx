
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
  FormMessage
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { UpdateProfileValidation } from "@/lib/validations"
import { useNavigate } from "react-router-dom"

import { useUpdateUser } from "@/lib/react-query/queriesAndMutations"
import Loader from "@/lib/shared/Loader"
import { Models } from "appwrite"
import FileUploader from "@/lib/shared/FileUploader"
import { Textarea } from "./ui/textarea"
import toast from "react-hot-toast"

function ProfileForm({user}: {user?: Models.Document}) {

  const { mutateAsync: updateUser, isPending } = useUpdateUser()
  const navigate = useNavigate()

  const form = useForm<z.infer<typeof UpdateProfileValidation>>({
    resolver: zodResolver(UpdateProfileValidation),
    defaultValues: {
      name: user ? user.name : "",
      username: user ? user.username : "",
      email: user ? user.email : "",
      bio: user ? user?.bio : "",
      file: user ? [user?.profileImage] : []
    },
  })
    
    async function onSubmit(values: z.infer<typeof UpdateProfileValidation>) {

        if (user) {
          const updatedUser = await updateUser({
            ...values,
            profileImage: user.profileImage,
            userId: user?.$id,
            imageId: user?.imageId,
        })

        if (!updatedUser) return toast.error("Could not be updated, please try again.")

        toast.success("Account updated successfully.")
        return navigate(`/profile/${user.$id}`)

        }
    }
    
    return (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col max-w-5xl w-full gap-9">
            
            <FormField
              control={form.control}
              name="file"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="shad-form_label">Add Photos</FormLabel>
                  <FormControl>
                    <FileUploader fieldChange={field?.onChange} isProfile={true} mediaUrl={user?.profileImage} />
                  </FormControl>
                  <FormMessage className="shad-form_message" />
                </FormItem>
              )}
            />
            <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel className="shad-form_label">Name</FormLabel>
                    <FormControl>
                        <Input className="shad-input" {...field} />
                    </FormControl>
                    <FormMessage className="shad-form_message" />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel className="shad-form_label">Username</FormLabel>
                    <FormControl>
                        <Input className="shad-input" {...field} />
                    </FormControl>
                    <FormMessage className="shad-form_message" />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel className="shad-form_label">Email</FormLabel>
                    <FormControl>
                        <Input className="shad-input" {...field} />
                    </FormControl>
                    <FormMessage className="shad-form_message" />
                    </FormItem>
                )}
            />
            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="shad-form_label">Bio</FormLabel>
                  <FormControl>
                    <Textarea className="shad-textarea custom-scrollbar" {...field} />
                  </FormControl>
                  <FormMessage className="shad-form_message" />
                </FormItem>
              )}
            />
            <div className="flex items-center justify-end gap-4">
                <Button type="button" className="shad-button_dark_4" onClick={() => form.reset()}>Cancel</Button>
                <Button type="submit" className="bg-primary-600 shad-button whitespace-nowrap">
                    {isPending  ? (
                        <span className="flex gap-3 items-center">
                            <Loader />
                            <span>Updating...</span>
                        </span>
                    ) : "Update"}
                </Button>
            </div>
          </form>
        </Form>
      )
}

export default ProfileForm