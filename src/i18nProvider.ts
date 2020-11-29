// Packages
import lodashGet from "lodash/get";
import englishMessages from "ra-language-english";
import { I18nProvider } from "react-admin";

const messages = {
  ...englishMessages,
  ra: {
    ...englishMessages.ra,
    notification: {
      ...englishMessages.ra.notification,
      invalid_email_password: "Invalid Email or Password",
    },
  },
  resources: {
    tasks: {
      name: "Tasks",
      fields: {
        id: "ID",
        name: "Name",
        password: "Password",
        email: "E-mail",
        birthdate: "Birthdate",
        updated_at: "Updated at",
        created_at: "Created at",
      },
    },
    users: {
      name: "Users",
      fields: {
        id: "ID",
        name: "Name",
        password: "Password",
        email: "E-mail",
        birthdate: "Birthdate",
        updated_at: "Updated at",
        created_at: "Created at",
      },
    },
  },
};

let locale = "en";

export const i18nProvider: I18nProvider = {
  translate: (key) => lodashGet(messages, key, key),
  changeLocale: (newLocale) => {
    return Promise.resolve();
  },
  getLocale: () => locale,
};
