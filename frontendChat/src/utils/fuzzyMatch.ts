import Fuse from "fuse.js";
import { userList } from "./aliasMap";


const fuse = new Fuse(userList, {
    threshold: 0.4,
    includeScore: true,
});

export function fuzzyFindUser(inputName: string): string | null {
    const result = fuse.search(inputName.trim().toLowerCase());
    console.log("Fuzzy search result:", result);
    if (result.length > 0) {
        return result[0].item;
    }
    return null;
}
