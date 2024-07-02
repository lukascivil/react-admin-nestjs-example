// Packages
import { AppState } from 'models/app.model'
import { useSelector, TypedUseSelectorHook } from 'react-redux'

export const useAppSelector = useSelector.withTypes<AppState>()
