import localforage from "localforage";

let fakeCache: FakeCache = {};

export async function set({key, value}: { key: string, value: any }) {
    await localforage.setItem(key, value);
}

export function fakeNetwork(key?: string): Promise<void> {
    if (!key) {
        fakeCache = {};
    }

    if (fakeCache[key ?? '']) {
        return Promise.resolve();
    }

    fakeCache[key ?? ''] = true;
    return new Promise((res) => {
        setTimeout(res, Math.random() * 800);
    });
}
