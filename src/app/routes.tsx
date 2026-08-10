import { createBrowserRouter } from 'react-router'
import RootLayout from './RootLayout'
import PublicRoot from './PublicRoot'
import AdminRoot from './AdminRoot'
import Home from '../pages/public/Home'
import Biography from '../pages/public/Biography'
import Publications from '../pages/public/Publications'
import Blog from '../pages/public/Blog'
import BlogPost from '../pages/public/BlogPost'
import Contact from '../pages/public/Contact'
import Login from '../pages/admin/Login'
import Dashboard from '../pages/admin/Dashboard'
import PostsList from '../pages/admin/PostsList'
import PostEditor from '../pages/admin/PostEditor'
import PublicationsManager from '../pages/admin/PublicationsManager'
import MediaLibrary from '../pages/admin/MediaLibrary'
import Settings from '../pages/admin/Settings'

export const router = createBrowserRouter([
  {
    Component: RootLayout,
    children: [
      {
        path: '/',
        Component: PublicRoot,
        children: [
          { index: true, Component: Home },
          { path: 'biography', Component: Biography },
          { path: 'publications', Component: Publications },
          { path: 'blog', Component: Blog },
          { path: 'blog/:slug', Component: BlogPost },
          { path: 'contact', Component: Contact },
        ],
      },
      { path: '/admin', Component: Login },
      { path: '/admin/login', Component: Login },
      {
        path: '/admin',
        Component: AdminRoot,
        children: [
          { path: 'dashboard', Component: Dashboard },
          { path: 'posts', Component: PostsList },
          { path: 'posts/:id', Component: PostEditor },
          { path: 'publications', Component: PublicationsManager },
          { path: 'publications/new', Component: PublicationsManager },
          { path: 'media', Component: MediaLibrary },
          { path: 'settings', Component: Settings },
        ],
      },
    ],
  },
])
