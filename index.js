async function openFile(e) {
    const [fileHandle] = await window.showOpenFilePicker();
    const key = await db.save(fileHandle);
    window.location = `editor.html#${key}`;
}

window.onload = async () => {
    const openFileButton = document.getElementById("fileOpen");
    openFileButton.addEventListener('click', openFile);

    const recentFiles = await db.list();
    const recentFilesEl = document.getElementById('recentFiles');
    if(recentFiles.length > 0) {
        recentFilesEl.removeChild(document.getElementsByTagName('i')[0]);
    }
    for(let recentFile of recentFiles) {
        const recentFileLink = document.createElement('a');
        console.log(recentFile)
        recentFileLink.setAttribute('href', `editor#${recentFile.key}`);
        recentFileLink.innerText = recentFile.name;

        const recentFileEl = document.createElement('li');
        recentFileEl.appendChild(recentFileLink);

        recentFilesEl.appendChild(recentFileEl);
    }
}