
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
import { SignInValidation } from "@/lib/validations"
import { Link, useNavigate } from "react-router-dom"

import { useSignIn } from "@/lib/react-query/queriesAndMutations"
import Loader from "@/lib/shared/Loader"
import { useUserAuth } from "@/context/AuthContext"
import toast from "react-hot-toast"

function SignInForm() {
  const { mutateAsync: getUserSession, isPending } = useSignIn()
  const { checkUser } = useUserAuth()
  const navigate = useNavigate()

  const form = useForm<z.infer<typeof SignInValidation>>({
    resolver: zodResolver(SignInValidation),
    defaultValues: {
      email: "",
      password: ""
    },
  })
 
  async function onSubmit(values: z.infer<typeof SignInValidation>) {
    const session = await getUserSession({email: values.email, password: values.password})

    if (!session) return toast.error("Sign In failed, Please try again.")

    const isLoggedIn = await checkUser()
    if (isLoggedIn) {
      form.reset()
      toast.success("Signed In Successfully.")
      navigate('/')
    } else return toast("Sign In failed, Please try again.")
  }
  
  return (
    <Form {...form}>

      <div className="sm:w-420 gap-y-1 p-3 space-y-5">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 w-full flex flex-col gap-5">
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
          <h2 className="font-bold text-lg py-2">Login to your account.</h2>
          <p className="text-sm font-thin">Welcome back, we are happy to have you back, now you can log in to your account to stay up to date.</p>
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
        <Button type="submit" className="bg-orange-600 hover:bg-orange-700">{
          isPending ? <div className="flex gap-2 items-center">
            <Loader />
            <span className="mx-2 text-sm">Loading...</span>
          </div> : 'Sign In'
        }</Button>
        <p className="text-light-2 text-sm pt-2">Don't have an account yet? <Link to={'/sign-up'} className="text-orange-400">Create an account.</Link></p>
      </form>
      </div>
    </Form>
  )
}

export default SignInForm