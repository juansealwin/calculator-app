import { useMemo } from "react"
import { IO } from "../utils/functional"
import { useNavigate } from "react-router-dom"

/* Add the necessary ptahs */
export const paths = {
  root: "/",
  newOperation: "/new-operation",
  operationHistory: "/records-history"
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
        newOperation: push(paths.newOperation),
        operationHistory: push(paths.operationHistory)
      },
      back: back
    }
  }, [navigate])
}

export type Navigation = ReturnType<typeof useNavigation>
