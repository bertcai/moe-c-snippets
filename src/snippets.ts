import localforage from "localforage";
import {matchSorter} from "match-sorter";
import sortBy from "sort-by";
import {fakeNetwork, set} from "./utils/storage";

export async function createSnippet(): Promise<Snippet> {
    let id = Math.random().toString(36).substring(2, 9);
    let snippet: Snippet = {
        id, name: 'default', createdAt: Date.now(),
        content:
            `function greet() {
              console.log('Hello, world!');}`,
        language: 'javascript', type: 'code', description: 'please input your description here',
    };
    let snippets = await getSnippets(undefined);
    snippets.unshift(snippet);
    await set({key: 'snippets', value: snippets});
    return snippet;
}

export async function getSnippets(
    query?: string | undefined, queryType: string | undefined = "name"
): Promise<Snippet[]> {
    await fakeNetwork(`getSnippets:${query}`);
    let snippets = (await localforage.getItem("snippets")) as Snippet[] | null;
    if (!snippets) snippets = [];
    if (query) {
        snippets = matchSorter(snippets, query, {keys: [queryType]});
    }
    return snippets.sort(sortBy("last", "createdAt"));
}

export async function getTagsList(): Promise<Option[]> {
    await fakeNetwork();
    let snippets = (await localforage.getItem("snippets")) as Snippet[] | null;
    let tags = snippets?.reduce((acc, snippet) => {
        return acc.concat(snippet.tags?.split(',') ?? []);
    }, [] as string[]);
    return [...new Set(tags ?? [])].map(i=>({value: i, label: i}));
}
export async function getLanguagesList(): Promise<Option[]> {
    await fakeNetwork();
    let snippets = (await localforage.getItem("snippets")) as Snippet[] | null;
    let languages = snippets?.reduce((acc, snippet) => {
        return acc.concat(snippet.language ?? []);
    }, [] as string[]);
    return [...new Set(languages ?? [])].map(i=>({value: i, label: i}));
}
export async function getTypesList(): Promise<Option[]> {
    await fakeNetwork();
    let snippets = (await localforage.getItem("snippets")) as Snippet[] | null;
    let types = snippets?.reduce((acc, snippet) => {
        return acc.concat(snippet.type ?? []);
    }, [] as string[]);
    return [...new Set(types ?? [])].map(i=>({value: i, label: i}));
}

export async function getSnippet(id: string): Promise<Snippet | null> {
    await fakeNetwork(`snippet:${id}`);
    let snippets = (await localforage.getItem("snippets")) as Snippet[] | null;
    let snippet = snippets?.find((snippet) => snippet.id === id);
    return snippet ?? null;
}

export async function updateSnippet(
    id: string,
    updates: Partial<Snippet>
) {
    await fakeNetwork();
    let snippets = (await localforage.getItem("snippets")) as Snippet[] | null;
    let snippet = snippets?.find((snippet) => snippet.id === id);
    if (!snippet) throw new Error("No snippet found for " + id);
    Object.assign(snippet, updates);
    await set({key: 'snippets', value: snippets});
    return snippet;
}

export async function deleteSnippet(id: string): Promise<boolean> {
    let snippets = (await localforage.getItem("snippets")) as Snippet[] | null;
    let index = snippets?.findIndex((snippet) => snippet.id === id) ?? -1;
    if (index > -1) {
        snippets?.splice(index, 1);
        await set({key: 'snippets', value: snippets});
        return true;
    }
    return false;
}
