import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter, Routes, Route } from 'react-router'
import MainLayout from './routes/layouts/mainLayout.jsx'
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'


// import HomePage from './routes/homePage/homePage.jsx'
// import CreatePage from './routes/createPage/createPage.jsx'
// import PostPage from './routes/postPage/postPage.jsx'
// import ProfilePage from './routes/profilePage/profilePage.jsx'
// import SearchPage from './routes/searchPage/searchPage.jsx'
// import AuthPage from './routes/authPage/authPage.jsx'



const HomePage = React.lazy(() => import("./routes/homePage/homePage"));
const CreatePage = React.lazy(() => import("./routes/createPage/createPage"));
const PostPage = React.lazy(() => import("./routes/postPage/postPage"));
const ProfilePage = React.lazy(() =>
  import("./routes/profilePage/profilePage")
);
const SearchPage = React.lazy(() => import("./routes/searchPage/searchPage"));
const AuthPage = React.lazy(() => import("./routes/authPage/authPage"));
// const TestPage = React.lazy(() => import("./routes/testPage/testPage"));


const queryClient = new QueryClient()


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
          <Routes>
            <Route element={<MainLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/create" element={<CreatePage />} />
              <Route path="/pin/:id" element={<PostPage />} />
              <Route path="/:username" element={<ProfilePage />} />
              <Route path="/search" element={<SearchPage />} />
            </Route>
            <Route path="/auth" element={<AuthPage />} />
            {/* <Route path="/test" element={<TestPage />} /> */}
          </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>
)
