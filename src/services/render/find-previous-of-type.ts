import { EntryType, Entry } from "../entries";

/**
 * Finds the first enty that prceeds the current pointer
 */
export function findPreviousOfType<T>(type: EntryType, pointer: number, entries: Entry<any>[]): Entry<T> | null {
   
    for (let i = entries.length - 1; i >= 0; --i) {
		const x = entries[i];
		if (x._type === type && x._tick <= pointer) {
			return x;
		}
    }
    
    return null;
    
}