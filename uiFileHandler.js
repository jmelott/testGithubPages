// File : uiFileHandler.js
document.addEventListener('DOMContentLoaded', function ()
{
	const fileName = document.getElementById('fileName');
	const fileDetails = document.getElementById('fileDetails');
	const functionList = document.getElementById('functionList');

	window.displayFileDetails = function (fileData)
	{
		fileName.textContent = ''; // Clears previous content
		fileDetails.textContent = ''; // Clears previous content
		const title = document.createElement('h2');
		title.textContent = fileData.filename;
		fileName.appendChild(title);

		// Create a map to store data for each key
		const dataMap = new Map();
		dataMap.set('description', 'Description');
		dataMap.set('namespace', 'Namespace');
		dataMap.set('classes', 'Classes');
		dataMap.set('declares_functions_in', 'Declares Functions In The Following Namespaces');
		dataMap.set('interacts_with', 'Interacts With Namespaces');
		dataMap.set('member_variables', 'Member Variables');
		dataMap.set('global_variables', 'Global Variables');
		dataMap.set('major_objects', 'Major Objects');
		dataMap.set('exports', 'Exported Items');



		// Function to create a table for object data
		function createTableForObject(objArray, titleText)
		{
			if (!objArray.length) return null; // Return null if the array is empty

			const section = document.createElement('section');
			section.style.marginBottom = '10px'; // Space between sections

			const title = document.createElement('h3');
			title.textContent = titleText;
			section.appendChild(title);

			const table = document.createElement('table');
			table.className = 'parameter-table';

			// Adding table headers
			const trHead = document.createElement('tr');
			Object.keys(objArray[0]).forEach(key =>
			{
				const th = document.createElement('th');
				th.textContent = key;
				trHead.appendChild(th);
			});
			table.appendChild(trHead);

			// Adding table data
			objArray.forEach(obj =>
			{
				const trData = document.createElement('tr');
				Object.keys(obj).forEach(key =>
				{
					const td = document.createElement('td');
					td.textContent = obj[key];
					trData.appendChild(td);
				});
				table.appendChild(trData);
			});

			section.appendChild(table);
			return section;
		}

		// Iterate over all properties in the fileData object
		Object.keys(fileData).forEach(key =>
		{
			if (key !== 'functions' && key !== 'filename')
			{ // Exclude 'functions' and 'filename'
				const content = fileData[key];

				// Handle different types of content
				if (key === 'description')
				{ // Display descriptions as separate paragraphs
					const descHeader = document.createElement('h3');
					descHeader.textContent = 'Description';
					fileDetails.appendChild(descHeader);
					content.forEach(line =>
					{
						const p = document.createElement('p');
						p.textContent = line;
						fileDetails.appendChild(p);
					});
				}
				else if (key === 'namespace' && content != "None")
				{ // Display namespace
					const keyHeader = document.createElement('h3');
					keyHeader.textContent = 'Namespace';
					fileDetails.appendChild(keyHeader);

					const p = document.createElement('p');
					const b = document.createElement('b');
					p.appendChild(b);
					if (Array.isArray(content))
					{ // If namespace is an array, display as a comma-separated list
						b.textContent = `${content.join(', ')}`;
					} else
					{ // If namespace is not an array, display the single value
						b.textContent = `${content}`;
					}
					fileDetails.appendChild(p);
				}
				else if (Array.isArray(content) && content.length > 0)
				{
					if (typeof content[0] === 'object')
					{ // Create tables for arrays of objects
						const tableSection = createTableForObject(content, dataMap.get(key));
						if (tableSection) fileDetails.appendChild(tableSection);
					} else
					{ // Display other arrays as comma-separated lists
						const keyHeader = document.createElement('h3');
						keyHeader.textContent = dataMap.get(key);
						fileDetails.appendChild(keyHeader);

						const p = document.createElement('p');
						p.textContent = `${content.join(', ')}`;
						fileDetails.appendChild(p);
					}
				}
			}
		});
	}

	window.listFunctions = function (fileData)
	{
		functionList.textContent = '';

		fileData.functions.forEach((func, index) =>
		{
			const funcEntry = document.createElement('div');
			const uniqueId = `${fileData.filename}-${func.name}-${index}`;
			if (func.namespace && func.namespace.length > 0 && func.namespace !== 'None')
			{
				funcEntry.textContent = `${func.namespace}.${func.name}`;
			}
			else 
			{
				funcEntry.textContent = func.name;
			}
			funcEntry.className = 'func-entry';
			funcEntry.id = "func." + uniqueId;
			funcEntry.onclick = () =>
			{
				const target = document.getElementById(uniqueId);
				if (target)
				{
					target.scrollIntoView({ behavior: 'smooth', block: 'start' });
					// Change the url to reflect the current file
					const url = new URL(window.location);
					url.searchParams.set('page', fileData.filename);
					url.searchParams.set('function', "func." + uniqueId);
					history.pushState(null, '', url); // Change URL without reload
				}
			};
			functionList.appendChild(funcEntry);
		});
	};
});
