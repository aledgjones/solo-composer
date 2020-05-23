import localforage from "localforage";

export const localconfig = localforage.createInstance({
    name: "sc:app"
});
