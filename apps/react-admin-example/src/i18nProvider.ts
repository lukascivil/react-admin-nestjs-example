// Packages
import englishMessages from 'ra-language-english'
import { I18nProvider } from 'react-admin'
import Polyglot from 'node-polyglot'

const messages = {
  ...englishMessages,
  ra: {
    ...englishMessages.ra,
    notification: {
      ...englishMessages.ra.notification,
      invalid_email_password: 'Invalid Email or Password'
    }
  },
  resources: {
    tasks: {
      name: 'Tasks',
      empty: 'No registered tasks',
      invite: 'Create new tasks',
      fields: {
        id: 'ID',
        title: 'Title',
        description: 'Description',
        updated_at: 'Updated at',
        created_at: 'Created at',
        completed: 'Completed'
      }
    },
    users: {
      name: 'Users',
      empty: 'No registered users',
      invite: 'Create new users',
      fields: {
        id: 'ID',
        name: 'Name',
        password: 'Password',
        email: 'E-mail',
        birthdate: 'Birthdate',
        updated_at: 'Updated at',
        created_at: 'Created at'
      }
    }
  }
}

const locale = 'en'

const polyglot = new Polyglot({
  locale,
  phrases: { '': '', ...messages }
})

export const i18nProvider: I18nProvider = {
  translate: (key, options) => {
    return polyglot.t(key, options)
  },
  changeLocale: () => {
    return Promise.resolve()
  },
  getLocale: () => locale
}
