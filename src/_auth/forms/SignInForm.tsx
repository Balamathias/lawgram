
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

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

import { useOAuthSignIn, useSignIn } from "@/lib/react-query/queriesAndMutations"
import { useUserAuth } from "@/context/AuthContext"
import toast from "react-hot-toast"
import { Button as NextUIButton, Divider, Image } from "@nextui-org/react"

function SignInForm() {
  const { mutateAsync: getUserSession, isPending } = useSignIn()
  const { isPending: isGetting } = useOAuthSignIn()
  const { checkUser } = useUserAuth()
  const navigate = useNavigate()

  const form = useForm<z.infer<typeof SignInValidation>>({
    resolver: zodResolver(SignInValidation),
    defaultValues: {
      email: "",
      password: ""
    },
  })

  async function handleOAuthSignIn() {
    // const session = await getUserOAuthSession()
    // console.log(session)
  }
 
  async function onSubmit(values: z.infer<typeof SignInValidation>) {
    const session = await getUserSession({email: values.email, password: values.password})

    if (!session) return toast.error("Sign In failed, Please try again. Ensure your email or password is correct")

    const isLoggedIn = await checkUser()
    if (isLoggedIn) {
      form.reset()
      toast.success("Signed In Successfully.")
      navigate('/')
    } else return toast("Sign In failed, Please try again. Ensure your email or password is correct.")
  }
  
  return (
    <Form {...form}>

      <div className="sm:w-420 gap-y-1 mt-6 md:mt-12 mb-4 p-4 md:p-8 space-y-5 opacity-100 bg-dark-1 rounded-lg shadow-xl">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 w-full flex flex-col gap-2">
          <div className="flex items-center gap-x-2">
            <Image
              src="/assets/images/mainlogo.png"
              className="object-cover rounded-full"
              width={40}
              height={40}
              alt="logo"
            />
            <span className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500">LawGram.</span>
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
        <NextUIButton isLoading={isPending} type="submit" className="bg-orange-600 text-light-2 hover:bg-orange-700">{
          isPending ?
            <span className="mx-2 text-sm">Loading...</span>: 'Sign In'
        }</NextUIButton>
        <p className="text-light-2 text-sm pt-2">Don't have an account yet? <Link to={'/sign-up'} className="text-orange-400">Create an account.</Link></p>
      </form>
      <Divider className="bg-light-4 my-4" />
      <NextUIButton
        onClick={handleOAuthSignIn}
        isLoading={isGetting} 
        className="flex w-full gap-2 items-center flex-row bg-dark-3 text-light-2 cursor-pointer">
        <Image 
          src={'/assets/images/google.png'}
          width={24}
          height={24}
          className="rounded-full"
        />
        <span>Continue with google</span>
      </NextUIButton>
      </div>
    </Form>
  )
}

export default SignInForm