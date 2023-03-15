import fs from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { nanoid } from "nanoid";
import ansi from "./node_modules/ansi-colors-es6/index.js";

const logsFolder = "db";

const __dirname = dirname(fileURLToPath(import.meta.url));
const logsDir = join(__dirname, `/${logsFolder}`);
const contactsPath = join(logsDir, "contacts.json");

//? Get a list of contacts: node index.js --action="list"
export function listContacts() {
  fs.readFile(contactsPath, { encoding: "utf8" }, (error, data) => {
    try {
      console.table(JSON.parse(data));
    } catch (error) {
      console.log(error.message);
    }
  });
}

//? Get a contact by id: node index.js --action="get" --id=...
export function getContactById(contactId) {
  fs.readFile(contactsPath, { encoding: "utf8" }, (error, data) => {
    try {
      const contacts = JSON.parse(data);
      const searchContact = contacts.find(
        (contact) => contact.id === contactId
      );
      if (searchContact === undefined) {
        return console.log(
          ansi.red(`Sorry, we did not find a contact with id: ${contactId}`)
        );
      }
      console.table(searchContact);
    } catch (error) {
      console.log(error.message);
    }
  });
}

//? Add a contact: node index.js --action="add" --name="..." --email="..." --phone="..."
export function addContact(name, email, phone) {
  fs.readFile(contactsPath, { encoding: "utf8" }, (error, data) => {
    try {
      const contacts = JSON.parse(data);
      const newContact = { id: nanoid(), name, email, phone };
      const contactsList = JSON.stringify(
        [...contacts, newContact],
        null,
        "\t"
      );
      fs.writeFile(contactsPath, contactsList, (error) => {
        if (error) console.error(error);
      });
      console.table(newContact);
    } catch (error) {
      console.log(error.message);
    }
  });
}

//? Remove a contact by id: node index.js --action="remove" --id=...
export function removeContact(contactId) {
  fs.readFile(contactsPath, { encoding: "utf8" }, (error, data) => {
    try {
      const contacts = JSON.parse(data);
      const index = contacts.findIndex((contact) => contact.id === contactId);
      if (index === -1) {
        return console.log(
          ansi.red(`Sorry, we did not find a contact with id: ${contactId}`)
        );
      }
      const deleteContact = contacts.splice(index, 1);
      const contactsList = JSON.stringify(contacts, null, "\t");
      fs.writeFile(contactsPath, contactsList, (error) => {
        if (error) console.error(error);
      });
      console.table(deleteContact);
    } catch (error) {
      console.log(error.message);
    }
  });
}