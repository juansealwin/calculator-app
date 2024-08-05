import React, { useMemo } from 'react'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'
import { HomePage } from './pages/Home'
import { State, usePersistentState, useStatefull } from './utils/state'
import { User, buildUser } from './user/User'
import { UserContext, useUser } from './hooks/context'
import { MainLayout } from './components/MainLayout'
import { Credentials, OptionalCredentialsCodec } from './utils/serialization'
import { LoginWindowStates } from './components/LoginWindow'
import { HistoryRecordPage } from './pages/HistoryRecordsPage'

const useUserCredentials = (credentials: State<Credentials | undefined>): User => {

  const user = useMemo(
    () => buildUser(credentials), 
    [credentials]
  )

  return user
}

const UserProvider = (
  props: {
    children: React.ReactNode
  }
) => {

  const credentials = usePersistentState<Credentials | undefined>(
    "credentials", 
    OptionalCredentialsCodec, 
    undefined
  )

  const user = useUserCredentials(credentials)

  return(
      <UserContext.Provider value={user}>
          {props.children}
      </UserContext.Provider>
  )
}

const CalculatorApp = () => 
  <UserProvider>
    <AppRouter/>
  </UserProvider>
  

const AppRouter = () => {
  
  const loginscreen = useStatefull<LoginWindowStates>(() => "hidden")
  const user = useUser()
  const reloadBalance = useStatefull(() => true)

  return (
    <Router basename="/calculator-app">
      <MainLayout loginScreen={loginscreen} reloadBalance={reloadBalance.value}>
        <Routes>
          {
            user.type === "visitor" ?
            <>
              <Route path="/" element={<HomePage loginScreen={loginscreen} reloadBalance={reloadBalance}/>} />
              <Route path="/new-operation" element={<Navigate to="/" />} />
              <Route path="/records-history" element={<Navigate to="/" />} />
            </> :
            <>
              <Route path="/" element={<HomePage loginScreen={loginscreen} reloadBalance={reloadBalance}/>} />
              <Route path="/new-operation" element={<HomePage loginScreen={loginscreen} reloadBalance={reloadBalance}/>} />
              <Route path="/records-history" element={<HistoryRecordPage/>} />
            </>
          }
        </Routes>
      </MainLayout>
    </Router>
  )
}

export default CalculatorApp