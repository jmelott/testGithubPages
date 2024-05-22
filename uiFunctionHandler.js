// File : uiFunctionHandler.js
document.addEventListener('DOMContentLoaded', function ()
{
	const functionInfo = document.getElementById('functionInfo');

	window.displayAllFunctionDetails = function (functions, filename)
	{
		const functionInfo = document.getElementById('functionInfo');
		functionInfo.textContent = ''; // Clear previous content

		if (!functions || functions.length === 0)
		{
			document.getElementById('functionDetails').style.display = 'none'; // Hide
			document.getElementById('noFunctions').style.display = 'block'; // Show
			return;
		}
		else
		{
			document.getElementById('noFunctions').style.display = 'none'; // Hide
			document.getElementById('functionDetails').style.display = 'flex'; // Show
		}

		functions.forEach((func, index) =>
		{
			const funcContainer = document.createElement('div');
			funcContainer.className = 'function-details';
			functionInfo.appendChild(funcContainer);

			const uniqueId = `${filename}-${func.name}-${index}`;

			// Anchor for the function
			const anchor = document.createElement('a');
			anchor.id = uniqueId
			anchor.style.display = 'block';  // Ensures the anchor affects layout and can be scrolled to
			anchor.style.height = '0';  // Zero height to avoid affecting layout
			funcContainer.appendChild(anchor);

			// Function Name
			const funcTitle = document.createElement('h3');
			funcTitle.textContent = func.name;
			funcContainer.appendChild(funcTitle);

			// Namespace
			if (func.namespace && func.namespace.length > 0 && func.namespace !== 'None') 
			{
				const namespace = document.createElement('p');
				namespace.textContent = "Namespace: " + func.namespace;
				funcContainer.appendChild(namespace);
			}

			// Signature
			const signature = document.createElement('p');
			const sigTitle = document.createElement('b');
			sigTitle.textContent = "Signature: ";
			signature.appendChild(sigTitle);
			const sigTitleLine = document.createElement('br');
			signature.appendChild(sigTitleLine);
			const sigText = document.createElement("span");
			sigText.textContent = func.signature;
			sigText.className = 'function-signature';
			signature.appendChild(sigText);
			funcContainer.appendChild(signature);

			// Description
			const description = document.createElement('p');
			const descTitle = document.createElement('b');
			descTitle.textContent = "Description: ";
			description.appendChild(descTitle);
			const descTitleLine = document.createElement('br');
			description.appendChild(descTitleLine);
			const descText = document.createElement('span');
			descText.textContent = func.description;
			descText.className = 'text-description';
			description.appendChild(descText);
			if (func.side_effects && func.side_effects.length > 0) 
			{
				description.appendChild(document.createElement('br'));
				const sideEffectTitle = document.createElement('b');
				sideEffectTitle.textContent = "Side Effects: ";
				description.appendChild(document.createElement('br'));
				description.appendChild(sideEffectTitle);
				for (const side_effect of func.side_effects) 
				{
					const side_effect_text = document.createElement('span');
					side_effect_text.textContent = side_effect;
					side_effect_text.className = 'text-description';
					description.appendChild(document.createElement('br'));
					description.appendChild(side_effect_text);
				}
			}
			if (func.called_urls && func.called_urls.length > 0) 
			{
				description.appendChild(document.createElement('br'));
				const calledURLTitle = document.createElement('b');
				calledURLTitle.textContent = "Called URLs: ";
				description.appendChild(document.createElement('br'));
				description.appendChild(calledURLTitle);
				for (const called_url of func.called_urls) 
				{
					const called_url_text = document.createElement('span');
					called_url_text.textContent = called_url;
					called_url_text.className = 'text-description';
					description.appendChild(document.createElement('br'));
					description.appendChild(called_url_text);
				}
			}

			funcContainer.appendChild(description);

			// Parameters
			if (func.parameters && func.parameters.length > 0)
			{
				const paramTitle = document.createElement('p');
				paramTitle.className = 'parameter-title';
				const paramTitleB = document.createElement('b');
				paramTitleB.textContent = "Parameters:";
				paramTitle.appendChild(paramTitleB);
				funcContainer.appendChild(paramTitle);

				const table = document.createElement('table');
				table.className = 'parameter-table';
				const headerRow = document.createElement('tr');

				const nameHeader = document.createElement('th');
				nameHeader.textContent = 'Name';
				headerRow.appendChild(nameHeader);

				const typeHeader = document.createElement('th');
				typeHeader.textContent = 'Type';
				headerRow.appendChild(typeHeader);

				const descriptionHeader = document.createElement('th');
				descriptionHeader.textContent = 'Description';
				headerRow.appendChild(descriptionHeader);

				table.appendChild(headerRow);

				for (const param of func.parameters)
				{
					const row = document.createElement('tr');

					const nameCell = document.createElement('td');
					nameCell.textContent = param.name;
					row.appendChild(nameCell);

					const typeCell = document.createElement('td');
					typeCell.textContent = param.type;
					row.appendChild(typeCell);

					const descriptionCell = document.createElement('td');
					descriptionCell.textContent = param.description;
					row.appendChild(descriptionCell);

					table.appendChild(row);
				}
				funcContainer.appendChild(table);
				funcContainer.appendChild(document.createElement('br'));
			}

			// Error Handling
			if (func.error_handling && func.error_handling.length > 0)
			{
				const errors = document.createElement('div');
				const errTitle = document.createElement('b');
				errTitle.textContent = "Error Handling: ";
				errors.appendChild(errTitle);

				// Make a table to display the error handling.  Each entry will have an error code and a description.
				const table = document.createElement('table');
				table.className = 'parameter-table';
				const headerRow = document.createElement('tr');
				table.appendChild(headerRow);
				// Add the headers
				const codeHeader = document.createElement('th');
				codeHeader.textContent = 'Error Code';
				headerRow.appendChild(codeHeader);	
				const descHeader = document.createElement('th');
				descHeader.textContent = 'Description';
				headerRow.appendChild(descHeader);
				// Add the rows
				for (const error of func.error_handling)
				{
					const row = document.createElement('tr');
					const codeCell = document.createElement('td');
					codeCell.textContent = error.errorCode;
					row.appendChild(codeCell);
					const descCell = document.createElement('td');
					descCell.textContent = error.description;
					row.appendChild(descCell);
					table.appendChild(row);
				}
				errors.appendChild(table);
				funcContainer.appendChild(errors);
				funcContainer.appendChild(document.createElement('br'));
			}


			// Returns
			if (func.returns)
			{
				const returns = document.createElement('div');
				const retTitle = document.createElement('b');
				retTitle.textContent = "Returns: ";
				returns.appendChild(retTitle);

				const retType = document.createElement('span');
				retType.className = 'text-description';
				if (func.returns.type == 'None'
					|| func.returns.type == 'none'
					|| func.returns.type == 'null'
					|| func.returns.type == 'void'
					|| func.returns.type == 'undefined')
				{
					retType.textContent = 'N/A';
				}
				else
				{
					retType.textContent = func.returns.type;
				}
				returns.appendChild(retType);

				returns.appendChild(document.createElement('br'));

				const retTypeDesc = document.createElement('span');
				retTypeDesc.className = 'text-description';
				retTypeDesc.textContent = func.returns.description;
				returns.appendChild(retTypeDesc);

				funcContainer.appendChild(returns);
			}
		});
	};

});
