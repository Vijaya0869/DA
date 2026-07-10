// utils/arrayUtils.js
export const removeDuplicates = (array: any) => {
    return [...new Set(array)];
};

export const groupBy = (array: any[], key: any) => {
    return array.reduce((result, item) => {
        (result[item[key]] = result[item[key]] || []).push(item);
        return result;
    }, {});
};

/**
 * Sorts an array by a key or a custom comparator function.
 * @param array - The array to sort.
 * @param keyOrFunc - The key to sort by or a comparator function.
 * @returns The sorted array.
 */
export function sortBy<T>(array: T[], keyOrFunc: keyof T | ((item: T) => any)): T[] {
    return array.slice().sort((a, b) => {
        const aValue = typeof keyOrFunc === 'function' ? keyOrFunc(a) : a[keyOrFunc];
        const bValue = typeof keyOrFunc === 'function' ? keyOrFunc(b) : b[keyOrFunc];
        if (aValue > bValue) return 1;
        if (aValue < bValue) return -1;
        return 0;
    });
}

/**
* Checks if an object exists in an array based on a unique key and adds it if not present.
* @param array - The array to check and modify.
* @param object - The object to check for and add.
* @param uniqueKey - The key used to determine uniqueness (e.g., 'id').
* @returns The modified array with the object added if it wasn't already present.
*/
export function addIfNotExists<T>(array: T[], object: T, uniqueKey: keyof T): T[] {
    // Check if the object already exists in the array based on the unique key
    //addIfNotExists(prevUsers, newUser, 'id')
    const exists = array.some(item => item[uniqueKey] === object[uniqueKey]);
    // Add the object to the array if it does not exist
    if (!exists) {
        array.push(object);
    }
    return array;
}


/**
* Removes an object from an array based on a unique key if it exists.
* @param array - The array to check and modify.
* @param object - The object to remove.
* @param uniqueKey - The key used to determine uniqueness (e.g., 'id').
* @returns The modified array with the object removed if it was present.
*/
export function removeIfExists<T>(array: T[], object: T, uniqueKey: keyof T): T[] {
    return array.filter(item => item[uniqueKey] !== object[uniqueKey]);
}

/**
* Merges two arrays and removes duplicates.
* @param array1 - The first array.
* @param array2 - The second array.
* @returns A new array with unique elements.
*/
export function mergeArray<T>(array1: T[], array2: T[]): T[] {
    const mergedArray = array1.concat(array2);
    return Array.from(new Set(mergedArray));
}
/**
 * Clones an array and updates specific attributes in an object based on a key.
 * @param array - The array to clone and modify.
 * @param key - The key to match for the object to update.
 * @param value - The value of the key to identify the object.
 * @param updates - An object containing the attributes to update.
 * @returns A new array with the specified object's attributes updated.
 */
export function cloneAndUpdateObjectByKey<T>(array: T[], key: keyof T, value: any, updates: Partial<T>): T[] {
    // Create a shallow copy of the array
    const newArray = array.map(item => ({ ...item }));

    // Find the index of the object to update
    const index = newArray.findIndex(item => item[key] === value);

    // Check if the object was found
    if (index !== -1) {
        // Clone the specific object and apply updates
        newArray[index] = { ...newArray[index], ...updates };
    }

    return newArray;
}

// utils/objectUtils.js

export const deepClone = (obj: any) => {
    return JSON.parse(JSON.stringify(obj));
};

export const isEmptyObject = (obj: any) => {
    return Object.keys(obj).length === 0 && obj.constructor === Object;
};
