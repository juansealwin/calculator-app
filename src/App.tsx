import React, { useMemo } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import UserRecords from './components/UserRecords';
import NewOperation from './components/NewOperation';
import { HomePage } from './pages/Home';
import { State, usePersistentState } from './utils/state';
import { User, buildUser } from './models/User';
import { UserContext } from './hooks/context';
import { MainLayout } from './components/MainLayout';
import { Credentials, CredentialsT } from './utils/serialization';
import { useQueryClient } from "react-query"
import { stringCodecOf } from './utils/codec';
import { OptionalOf } from './utils/model';

const useUserCredentials = (credentials: State<Credentials | undefined>): User => {

  const queryClient = useQueryClient()

  const user = useMemo(
    () => buildUser(credentials, queryClient), 
    [credentials.value?.token]
  )

  return user
}


const CalculatorApp = () => {

  const credentials = usePersistentState<Credentials | undefined>(
    "credentials", 
    stringCodecOf(OptionalOf(CredentialsT)), 
    undefined
  )

  const user = useUserCredentials(credentials)

  return (
      <UserContext.Provider value={user}>
          <AppRouter/>
      </UserContext.Provider>
  )
}


const AppRouter = () => 
  <Router>
    <MainLayout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/new-operation" element={<NewOperation />} />
        <Route path="/user-records" element={<UserRecords />} />
      </Routes>
    </MainLayout>
  </Router>

export default CalculatorApp