import { useMemo } from "react"
import { IO } from "../utils/functional"
import { useNavigate } from "react-router-dom"

/* Add the necessary ptahs */
export const paths = {
  root: "/",
  home: "/home",
  newOperation: "/newOperation",
  operationHistory: "/operationHistory",
}

export const useNavigation = () => {

  const navigate = useNavigate()

  return useMemo(() => {
        
    const push = (path: string): IO<void> => 
      () => { navigate(path) }

    const back: IO<void> = () => { navigate(-1) }

    return {
      goTo: {
        root: push(paths.root),
        home: push(paths.home),
        newOperation: push(paths.newOperation),
        operationHistory: push(paths.operationHistory),
      },
      back: back
    }
  }, [navigate])
}

export type Navigation = ReturnType<typeof useNavigation>
