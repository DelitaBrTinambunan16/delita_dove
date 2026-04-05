import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
// import App from './App.jsx'
import './tailwind.css'
import UserForm from './Pertemuan3/UserForm'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* <App /> */}
    <UserForm/>
  </StrictMode>,
)
