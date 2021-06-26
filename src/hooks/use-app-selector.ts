// Packages
import { AppState } from 'models/app.model'
import { TypedUseSelectorHook, useSelector } from 'react-redux'

export const useAppSelector: TypedUseSelectorHook<AppState> = useSelector
