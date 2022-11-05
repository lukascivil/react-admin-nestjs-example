import { FC } from 'react'
import { MenuItemLink } from 'react-admin'
import { Label as LabelIcon, People as PeopleIcon, Book as BookIcon } from '@mui/icons-material'

export const CustomMenu: FC = () => (
  <div>
    <MenuItemLink to="/tasks" primaryText="tasks" leftIcon={<BookIcon />} />
    <MenuItemLink to="/users" primaryText="users" leftIcon={<PeopleIcon />} />
    {/* Outside RA resource pattern */}
    <MenuItemLink to="/custom" primaryText="Custom example" leftIcon={<LabelIcon />} />
    <MenuItemLink to="/rtk" primaryText="RTK Query example" leftIcon={<LabelIcon />} />
  </div>
)
