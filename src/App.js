import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import RegisterView from './views/auth/RegisterView';
import LoginView from './views/auth/LoginView';
import ProtectedRoutes from './components/ProtectedRoutes';
import { AuthProvider } from './context/AuthContext';
import Navbar from './views/layouts/Navbar';
import UsersView from './views/dashboard/UsersView';
import AddUserView from './views/dashboard/AddUserView';
import EditUserView from './views/dashboard/EditUserView';


export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<LoginView />}></Route>
          <Route path='*' element={<LoginView />} />
          <Route path='/register' element={<RegisterView />}></Route>
          <Route path='/users' element={
            <ProtectedRoutes>
              <Navbar />
              <UsersView />
            </ProtectedRoutes>
          }/>
          <Route path='/add-user' element={
            <ProtectedRoutes>
              <AddUserView />
            </ProtectedRoutes>
          }/>
          <Route path='/users/:id' element={
            <ProtectedRoutes>
              <EditUserView />
            </ProtectedRoutes>
          }/>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}