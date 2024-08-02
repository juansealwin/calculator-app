import React, { useMemo } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { HomePage } from './pages/Home';
import { State, usePersistentState, useStatefull } from './utils/state';
import { User, buildUser } from './user/User';
import { UserContext, useUser } from './hooks/context';
import { MainLayout } from './components/MainLayout';
import { Credentials, CredentialsT } from './utils/serialization';
import { useQueryClient } from "react-query"
import { stringCodecOf } from './utils/codec';
import { OptionalOf } from './utils/model';
import { LoginWindowStates } from './components/LoginWindow';
import { HistoryRecordPage } from './pages/HistoryRecordsPage';
import { SetBalancePage } from './pages/SetBalancePage';

const useUserCredentials = (credentials: State<Credentials | undefined>): User => {

  const queryClient = useQueryClient()

  const user = useMemo(
    () => buildUser(credentials, queryClient), 
    [credentials, queryClient]
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


const AppRouter = () => {
  
  const loginscreen = useStatefull<LoginWindowStates>(() => "hidden")
  const user = useUser()

  return <Router>
    <MainLayout loginScreen={loginscreen}>
      <Routes>
        {
          user.type === "visitor" ?
          <>
            <Route path="/" element={<HomePage loginScreen={loginscreen}/>} />
            <Route path="/new-operation" element={<Navigate to="/" />} />
            <Route path="/records-history" element={<Navigate to="/" />} />
            <Route path="/set-balance" element={<Navigate to="/" />} />
          </> :
          <>
            <Route path="/" element={<HomePage loginScreen={loginscreen}/>} />
            <Route path="/new-operation" element={<HomePage loginScreen={loginscreen}/>} />
            <Route path="/records-history" element={<HistoryRecordPage/>} />
            <Route path="/set-balance" element={<SetBalancePage/>} />
          </>
        }
      </Routes>
    </MainLayout>
  </Router>
}

export default CalculatorApp