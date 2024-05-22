// File : dataLoader.js
document.addEventListener('DOMContentLoaded', function ()
{
    //Set the version number in the html
    const version = document.getElementById('versionSpan');
    if (window.versionText != undefined)
    {
        version.textContent = 'Version: ' + window.versionText;
    }
    
    const fileTree = document.getElementById('fileTree');

    function loadFiles(files)
    {
        Promise.all(files.map(file =>
        {
            return fetch(file)
                .then(response => response.json())
                .then(data => createFileEntry(data))
                .catch(error => console.error('Error loading file:', file, error));
        })).then(() =>
        {
            //Check if the URL has a page parameter
            const url = new URL(window.location);
            const page = url.searchParams.get('page');
            const functionId = url.searchParams.get('function');
            console.log('Function ID: ' + functionId)
            if (page && page.length > 0)
            {
                const fileEntries = Array.from(document.getElementsByClassName('file-entry'));
                const fileEntry = fileEntries.find(entry => entry.textContent.includes(page));
                if (fileEntry) 
                {
                    fileEntry.click(); // Simulates a click on the file entry
                }

                // If a function was defined and the function details are visible, click on that entry to scroll to the details
                console.log(document.getElementById('functionDetails').style.display);
                if (functionId && functionId.length > 0 && document.getElementById('functionDetails').style.display != 'none')
                {
                    //Find the function element in the functions table that has the same id as the functionId
                    const target = document.getElementById(functionId);
                    if (target)
                    {
                        target.click();
                    }
                }
            }
            else
            {
            // After all files are loaded and entries created, click the first entry
                const firstEntry = fileTree.getElementsByClassName('file-entry')[0];
                if (firstEntry)
                {
                    firstEntry.click(); // Simulates a click on the first file entry
                }
            }
        });
    }

    function createFileEntry(fileData)
    {
        const fileEntry = document.createElement('div');
        fileEntry.textContent = fileData.filename;
        fileEntry.className = 'file-entry';
        fileEntry.onclick = () =>
        {
            const currentlyHighlighted = document.querySelector('.highlighted');
            if (currentlyHighlighted)
            {
                currentlyHighlighted.classList.remove('highlighted');
            }
            fileEntry.classList.add('highlighted');
            window.displayFileDetails(fileData);
            window.listFunctions(fileData);
            window.displayAllFunctionDetails(fileData.functions, fileData.filename);
            
            // Change the url to reflect the current file
            const url = new URL(window.location);
            url.searchParams.set('page', fileData.filename);
            url.searchParams.set('function', '');
            history.pushState(null, '', url); // Change URL without reload
        };
        fileTree.appendChild(fileEntry);
    }

    if (window.fileData)
    {
        loadFiles(window.fileData);
    } else
    {
        console.log('File data not found.' + window.fileData);
    }
});
