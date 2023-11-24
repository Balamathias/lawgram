
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
import { SignUpValidation } from "@/lib/validations"
import { Link, useNavigate } from "react-router-dom"

import { useCreateNewUser, useOAuthSignUp, useSignIn } from "@/lib/react-query/queriesAndMutations"
import { useUserAuth } from "@/context/AuthContext"
import toast from "react-hot-toast"
import { Divider, Image, Button as NextUIButton } from "@nextui-org/react"

function SignUpForm() {
  const { mutateAsync: createUserAccount, isPending } = useCreateNewUser()
  const { mutateAsync: getUserSession } = useSignIn()
  const { mutateAsync: getUserOAuthSession, isPending: isGetting } = useOAuthSignUp()
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

  async function handleOAuthSignUp() {
    await getUserOAuthSession()
  }
 
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

      <div className="sm:w-420 gap-y-1 mt-6 md:mt-12 mb-4 md:pt-6 p-4 md:p-8 space-y-5 opacity-100 bg-dark-1 rounded-lg shadow-xl">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 w-full flex flex-col gap-0.5">
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
        <NextUIButton isLoading={isPending} type="submit" className="bg-orange-600 text-light-2 hover:bg-orange-700">{
          isPending ?
            <span className="mx-2 text-sm">Loading...</span>: 'Sign Up'
        }</NextUIButton>
        <p className="text-light-2 text-sm pt-2">Already have an account? <Link to={'/sign-in'} className="text-orange-400">Log in</Link></p>
      </form>
      <Divider className="bg-light-4 my-4" />
      <NextUIButton
        onClick={handleOAuthSignUp} 
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

export default SignUpForm