import React, { FC } from 'react'
import { MenuItemLink } from 'react-admin'
import BookIcon from '@material-ui/icons/Book'
import PeopleIcon from '@material-ui/icons/People'
import LabelIcon from '@material-ui/icons/Label'

export const CustomMenu: FC = () => (
  <div>
    <MenuItemLink to="/tasks" primaryText="tasks" leftIcon={<BookIcon />} />
    <MenuItemLink to="/users" primaryText="users" leftIcon={<PeopleIcon />} />
    <MenuItemLink to="/custom" primaryText="Custom example" leftIcon={<LabelIcon />} />
    <MenuItemLink to="/rtk" primaryText="RTK Query example" leftIcon={<LabelIcon />} />
  </div>
)
