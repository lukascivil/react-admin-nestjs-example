// Packages
import React, { useMemo, FC, memo, ReactElement, cloneElement } from 'react'
import Typography from '@material-ui/core/Typography'
import { usePermissions } from 'ra-core'
import { sanitizeFieldRestProps } from 'ra-ui-materialui'

type Role = 'n1' | 'n2' | 'n3' | 'n4' | 'n5'

interface Props {
  lock?: Array<Role>
  unlock?: Array<Role>
  children: ReactElement
  // Extra
  label?: string
  value?: string
  source?: string
}

const Locker: FC<Props> = memo(({ children, lock = [], unlock = [], ...rest }) => {
  const { permissions } = usePermissions()
  const authorized = useMemo(() => {
    return !lock.some(el => permissions?.includes(el)) && unlock.some(el => permissions?.includes(el))
  }, [lock, unlock, permissions])

  return authorized ? (
    cloneElement(children, rest)
  ) : (
    <Typography component="span" variant="body2" {...sanitizeFieldRestProps(rest)}>
      Conteúdo Bloqueado
    </Typography>
  )
})

export default Locker
