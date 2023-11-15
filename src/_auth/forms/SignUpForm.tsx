
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
import { SignUpValidation } from "@/lib/validations"
import { Link, useNavigate } from "react-router-dom"

import { useCreateNewUser, useSignIn } from "@/lib/react-query/queriesAndMutations"
import Loader from "@/lib/shared/Loader"
import { useUserAuth } from "@/context/AuthContext"
import toast from "react-hot-toast"

function SignUpForm() {
  const { mutateAsync: createUserAccount, isPending } = useCreateNewUser()
  const { mutateAsync: getUserSession } = useSignIn()
  const { checkUser } = useUserAuth()
  const navigate = useNavigate()

  const form = useForm<z.infer<typeof SignUpValidation>>({
    resolver: zodResolver(SignUpValidation),
    defaultValues: {
      name: "",
      username: "",
      email: "",
      password: ""
    },
  })
 
  async function onSubmit(values: z.infer<typeof SignUpValidation>) {
    const user = await createUserAccount(values)
    if (!user) return toast.error("Sign up failed, Please try again.")

    const session = await getUserSession({email: values.email, password: values.password})

    if (!session) return toast.error("Sign up failed, Please try again.")

    const isLoggedIn = await checkUser()
    if (isLoggedIn) {
      form.reset()
      toast.success('Account created successfully.')
      navigate('/')
    } else return toast.error("Sign up failed, Please try again.")
  }
  
  return (
    <Form {...form}>

      <div className="sm:w-420 gap-y-1 p-3 space-y-5 md:pt-6">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 w-full flex flex-col gap-1">
          <div className="flex items-center gap-x-2">
            <img
              src="/assets/images/slide_1.png"
              className="object-cover rounded-full"
              width={40}
              height={40}
              alt="logo"
            />
            <span className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500">Lawgram.</span>
          </div>
          <h2 className="font-bold text-lg py-1">Create an account.</h2>
          <p className="text-sm font-thin">Hi there! Create an account on Lawgram to stay up to date with our trending feeds.</p>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" className="shad-input" {...field} />
                </FormControl>
                <FormMessage className="text-rose-700 text-opacity-60" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="John" className="shad-input" {...field} />
                </FormControl>
                <FormMessage className="text-rose-700 text-opacity-60" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input placeholder="Your password" type="password" className="shad-input"  {...field} />
                </FormControl>
                <FormMessage className="text-rose-700 text-opacity-60" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="john@gmail.com" type="email" className="shad-input" {...field} />
                </FormControl>
                <FormMessage className="text-rose-700 text-opacity-60" />
              </FormItem>
          )}
        />
        <Button type="submit" className="bg-orange-600 hover:bg-orange-700">{
          isPending ? <div className="flex gap-2 items-center">
            <Loader />
            <span className="mx-2 text-sm">Loading...</span>
          </div> : 'Sign Up'
        }</Button>
        <p className="text-light-2 text-sm pt-2">Already have an account? <Link to={'/sign-in'} className="text-orange-400">Log in</Link></p>
      </form>
      </div>
    </Form>
  )
}

export default SignUpForm