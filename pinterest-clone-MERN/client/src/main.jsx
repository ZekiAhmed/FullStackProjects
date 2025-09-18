import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter, Routes, Route } from 'react-router'
import HomePage from './pages/homePage/homePage.jsx'
import CreatePage from './pages/createPage/createPage.jsx'
import PostPage from './pages/postPage/postPage.jsx'
import ProfilePage from './pages/profilePage/profilePage.jsx'
import SearchPage from './pages/searchPage/searchPage.jsx'
import AuthPage from './pages/authPage/authPage.jsx'
import MainLayout from './pages/layouts/mainLayout.jsx'


createRoot(document.getElementById('root')).render(
  <StrictMode>
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
        </Routes>
    </BrowserRouter>
  </StrictMode>,
)
