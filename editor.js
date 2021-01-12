window.onload = async () => {
    const requestPermissions = document.getElementById('requestPermissions');
    const editor = document.getElementById('editor');

    const fileKey = parseInt(window.location.hash.substring(1));
    const fileHandle = await db.get(fileKey);

    let currentTimeout = null;
    function throttledSaveFile() {
        if(currentTimeout === null) {
            currentTimeout = setTimeout(saveFile, 1000);
        }
    }

    async function saveFile() {
        const writable = await fileHandle.createWritable();
        // writable.truncate(0);
        await writable.write(editor.value);
        await writable.close();

        currentTimeout = null;
    }
    editor.addEventListener('keyup', throttledSaveFile);

    requestPermissions.onclick = async () => {
        const writable = await fileHandle.createWritable();
        const file = await fileHandle.getFile();
        const contents = await file.text();
        editor.value = contents;

        requestPermissions.style.display = 'none';
        editor.style.display = '';
    };
};