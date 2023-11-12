import * as z from "zod"

 
export const SignUpValidation = z.object({
  name: z.string().min(2, {message: "Name is too short."}),
  username: z.string().min(2, {message: "Username is too short"}),
  email: z.string().regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, {message: "Please provide a valid email address."}),
  password: z.string().min(8, {message: "Your password is too short! Ensure it exceeds eight characters."})
})
 
export const SignInValidation = z.object({
  email: z.string().regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, {message: "Please provide a valid email address."}),
  password: z.string().min(8, {message: "Your password is too short! Ensure it exceeds eight characters."})
})

export const PostValidation = z.object({
  caption: z.string().min(2, {
    message: "Caption must be at least 2 characters.",
  }).max(2200, {message: "Post too long! Post should not exceed 2200 words."}),
  file: z.custom<File[]>(),
  location: z.string().max(100),
  tags: z.string()
})

export const UpdateProfileValidation = z.object({
  name: z.string().min(2, {message: "Name is too short."}),
  username: z.string().min(2, {message: "Username is too short"}),
  bio: z.string(),
  email: z.string().regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, {message: "Please provide a valid email address."}),
  file: z.custom<File[]>(),
})

