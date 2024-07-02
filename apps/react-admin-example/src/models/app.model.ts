import createAdminStore from 'create-admin-store'

export type AppState = ReturnType<ReturnType<typeof createAdminStore>['getState']>
