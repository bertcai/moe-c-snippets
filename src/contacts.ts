import localforage from "localforage";
import {matchSorter} from "match-sorter";
import sortBy from "sort-by";
import {fakeNetwork} from "./utils/storage";

export async function getContacts(
    query?: string | undefined
): Promise<Contact[]> {
    await fakeNetwork(`getContacts:${query}`);
    let contacts = (await localforage.getItem("contacts")) as Contact[] | null;
    if (!contacts) contacts = [];
    if (query) {
        contacts = matchSorter(contacts, query, {keys: ["first", "last"]});
    }
    return contacts.sort(sortBy("last", "createdAt"));
}

export async function createContact(): Promise<Contact> {
    await fakeNetwork();
    let id = Math.random().toString(36).substring(2, 9);
    let contact: Contact = {id, createdAt: Date.now()};
    let contacts = await getContacts(undefined);
    contacts.unshift(contact);
    await set(contacts);
    return contact;
}

export async function getContact(id: string): Promise<Contact | null> {
    await fakeNetwork(`contact:${id}`);
    let contacts = (await localforage.getItem("contacts")) as Contact[] | null;
    let contact = contacts?.find((contact) => contact.id === id);
    return contact ?? null;
}

export async function updateContact(
    id: string,
    updates: Partial<Contact>
): Promise<Contact> {
    await fakeNetwork();
    let contacts = (await localforage.getItem("contacts")) as Contact[] | null;
    let contact = contacts?.find((contact) => contact.id === id);
    if (!contact) throw new Error("No contact found for " + id);
    Object.assign(contact, updates);
    await set(contacts);
    return contact;
}

export async function deleteContact(id: string): Promise<boolean> {
    let contacts = (await localforage.getItem("contacts")) as Contact[] | null;
    let index = contacts?.findIndex((contact) => contact.id === id) ?? -1;
    if (index > -1) {
        contacts?.splice(index, 1);
        await set(contacts);
        return true;
    }
    return false;
}

async function set(contacts: Contact[] | null): Promise<void> {
    await localforage.setItem("contacts", contacts);
}