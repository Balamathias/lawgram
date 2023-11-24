import './globals.css'
import {Routes, Route} from 'react-router-dom'
import SignInForm from './_auth/forms/SignInForm'
import AuthLayout from './_auth/AuthLayout'
import SignUpForm from './_auth/forms/SignUpForm'
import RootLayout from './_root/RootLayout'
import { Toaster as ShadToast } from './components/ui/toaster'
import { Toaster } from 'react-hot-toast'

import { Home, Explore, SavedPosts, AllUsers, CreatePost, NotFound, UpdatePost, UpdateProfile, Profile, PostDetails, LikedPosts, TagPosts } from './_root/pages'

const App = () => {
  return (
    <main className="flex h-screen">
      <Routes>
        {/* Public routes */}
        <Route element={<AuthLayout />}>
          <Route path="/sign-in" element={<SignInForm />} />
          <Route path="/sign-up" element={<SignUpForm />} />
        </Route>
        <Route path='*' element={<NotFound />} />

        {/* Private routes */}
        <Route element={<RootLayout />}>
          <Route index element={<Home />} />
          <Route path='/explore' element={<Explore />} />
          <Route path='/saved' element={<SavedPosts />} />
          <Route path='/liked' element={<LikedPosts />} />
          <Route path='/all-users' element={<AllUsers />} />
          <Route path='/create-post' element={<CreatePost />} />
          <Route path='/update-post/:id' element={<UpdatePost />} />
          <Route path='/posts/:id' element={<PostDetails />} />
          <Route path='/profile/:id/*' element={<Profile />} />
          <Route path='/update-profile/:id' element={<UpdateProfile />} />
          <Route path='/posts/tags' element={<TagPosts />} />
        </Route>
      </Routes>
      <ShadToast />
      <Toaster
        toastOptions={{
          position: "top-right",
          success: {
            className: "p-4 rounded-lg border border-green-800 bg-dark-1 shadow-md text-green-700",
            style: {
              color: "lightgreen",
              padding: "7px",
              borderRadius: "4px",
              backgroundColor: "#111",
              border: "1px solid darkgreen"
            }
          },
          error: {
            className: "p-4 rounded-lg border border-rose-800 bg-dark-1 shadow-md text-rose-700",
            style: {
              color: "lightpink",
              padding: "7px",
              borderRadius: "4px",
              backgroundColor: "#111",
              border: "1px solid lightred"
            }
          },
        }}
      />
    </main>
  )
}

export default App
