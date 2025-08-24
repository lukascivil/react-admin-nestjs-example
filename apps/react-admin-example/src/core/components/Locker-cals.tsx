import React, { ReactElement } from 'react'
import { AbilityBuilder, createMongoAbility, MongoAbility } from '@casl/ability'
import { usePermissions } from 'react-admin'

type Actions = 'create' | 'read' | 'update' | 'delete' | 'export'

type Subjects = 'article' | 'comment' | 'users'

interface LockerCasl {
  source?: string
  action: Actions
  field?: string
  subject: Subjects
  children: ReactElement
}

// const ability = createMongoAbility<[Actions, Subjects]>()

type AppAbility = MongoAbility<[Actions, Subjects]>

const defineAbilityFor = (role: 'n1' | 'n2') => {
  // const { can, build } = createMongoAbility<[Actions, Subjects]>()
  const { can, build } = new AbilityBuilder<AppAbility>(createMongoAbility)

  if (role.includes('n1')) {
    can('read', 'users', 'name')
  }

  if (role.includes('n2')) {
    can('read', 'users', 'name')
    can('read', 'users', 'name')
  }

  if (role.includes('n5')) {
    can('create', 'users')
    can('export', 'users')
  }

  return build()
}

const LockerCasl = ({ action, subject, field, children }: LockerCasl): ReactElement => {
  const { permissions } = usePermissions()
  const ability = defineAbilityFor(permissions)

  console.log({ permissions, cafe: ability.rules })

  return ability.can(action, subject, field) ? children : <p>❌ A/N</p>
}

export default LockerCasl
