// Packages
import { AppState } from 'models/app.model'
import {  useSelector } from 'react-redux'

export const useAppSelector = useSelector.withTypes<AppState>()