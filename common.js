const db = { idb: null };

db.init = () => {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('EditorDatabase');
        request.onerror = reject;
        request.onsuccess = (e) => {
            db.idb = e.target.result;
            resolve();
        };
        request.onupgradeneeded = function(event) {
            const idb = event.target.result;
          
            // Create a store for recent files and their handles
            const recentStore = idb.createObjectStore('recentFiles', { autoIncrement: true });
            recentStore.createIndex('name', 'name', { unique: false });
        };
    });
};

db.save = (fileHandle) => {
    return new Promise(async (resolve, reject) => {
        if(!db.idb) {
            await db.init();
        }

        const recentEntry = {
            name: fileHandle.name,
            handle: fileHandle
        };
        
        const store = db.idb.transaction(['recentFiles'], 'readwrite').objectStore('recentFiles');
        const req = store.add(recentEntry);
        req.onsuccess = (e) => {
            resolve(e.target.result);
        };
        req.onerror = reject;
    });
};

db.get = (key) => {
    return new Promise(async (resolve, reject) => {
        if(!db.idb) {
            await db.init();
        }

        const store = db.idb.transaction(['recentFiles'], 'readwrite').objectStore('recentFiles');
        const req = store.get(key);
        req.onerror = reject;
        req.onsuccess = (e) => {
            resolve(req.result.handle);
        };
    });
};

db.list = () => {
    return new Promise(async (resolve, reject) => {
        if(!db.idb) {
            await db.init();
        }

        const store = db.idb.transaction(['recentFiles'], 'readwrite').objectStore('recentFiles');
        const recentFiles = [];

        const cursorReq = store.openCursor();
        cursorReq.onerror = reject;
        cursorReq.onsuccess = (e) => {
            const cursor = e.target.result;
            if(cursor) {
                recentFiles.push({ key: cursor.key, ...cursor.value });
                cursor.continue();
            }
            else {
                resolve(recentFiles);
            }
        };
    });
};
