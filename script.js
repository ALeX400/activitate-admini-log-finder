document.getElementById('dropZone').addEventListener('click', () => document.getElementById('fileInput').click());
document.getElementById('fileInput').addEventListener('change', handleFiles);
document.getElementById('addCommand').addEventListener('click', addCommandInput);
document.body.addEventListener('paste', handlePaste);
document.getElementById('find').addEventListener('click', findInLogs);

document.getElementById('toggleFileList').addEventListener('click', function () {
	const fileListContainer = document.getElementById('fileListContainer');
	if (fileListContainer.classList.contains('collapse')) {
		fileListContainer.classList.remove('collapse');
		fileListContainer.classList.add('expand');
		this.textContent = 'Hide Files'; // Schimbă textul butonului
	} else {
		fileListContainer.classList.add('collapse');
		fileListContainer.classList.remove('expand');
		this.textContent = 'Show Files'; // Schimbă textul butonului
	}
});

let filesContent = [];

function handleFiles(event) {
	processFiles(event.target.files);
}

function processFiles(files) {
	Array.from(files).forEach(file => {
		const reader = new FileReader();
		reader.onload = function (e) {
			const content = e.target.result;
			filesContent.push({ name: file.name, content: content });
			updateFileList();
		};
		reader.readAsText(file);
	});
}

function addCommandInput() {
	const commandContainer = document.getElementById('commandContainer');
	const newCommandDiv = document.createElement('div');
	newCommandDiv.className = 'command';

	const newInput = document.createElement('input');
	newInput.type = 'text';
	newInput.className = 'commandInput';
	newInput.placeholder = 'Command';

	const removeButton = document.createElement('button');
	removeButton.textContent = '-';
	removeButton.className = 'removeCommand';
	removeButton.onclick = function () {
		commandContainer.removeChild(newCommandDiv);
	};

	newCommandDiv.appendChild(newInput);
	newCommandDiv.appendChild(removeButton);
	commandContainer.appendChild(newCommandDiv);
}

function handlePaste(e) {
	if (e.clipboardData && e.clipboardData.files.length > 0) {
		processFiles(e.clipboardData.files);
	}
}

/*function findInLogs() {
	const adminName = document.getElementById('adminName').value.trim();
	const commands = Array.from(document.getElementsByClassName('commandInput')).map(input => input.value.trim()).filter(value => value);
	const resultsElement = document.getElementById('results');
	resultsElement.textContent = '';

	filesContent.forEach(file => {
		const dateMatch = file.name.match(/activitate_admini_(\d{2}-\d{2}-\d{4})\.txt$/);
		const date = dateMatch ? dateMatch[1] : 'Unknown Date';
		let regexPattern = adminName ? adminName : '';
		if (commands.length > 0) {
			regexPattern += regexPattern ? '.*?(' : '(';
			regexPattern += commands.map(cmd => `'${cmd}.*?'`).join('|') + ')';
		}
		const regex = new RegExp(regexPattern, 'gi');

		file.content.split('\n').forEach(line => {
			if (regex.test(line)) {
				resultsElement.textContent += `${date}: ${line}\n`;
			}
		});
	});
}*/

function findInLogs() {
	const adminName = document.getElementById('adminName').value.trim();
	const commands = Array.from(document.getElementsByClassName('commandInput')).map(input => input.value.trim()).filter(value => value);
	const resultsElement = document.getElementById('results');
	resultsElement.textContent = '';

	// Sortăm filesContent descrescător pe baza datei din numele fiecărui fișier
	const sortedFilesContent = filesContent.sort((a, b) => {
		const dateA = a.name.match(/activitate_admini_(\d{2})-(\d{2})-(\d{4})\.txt$/);
		const dateB = b.name.match(/activitate_admini_(\d{2})-(\d{2})-(\d{4})\.txt$/);
		const formattedDateA = dateA ? `${dateA[3]}${dateA[2]}${dateA[1]}` : '';
		const formattedDateB = dateB ? `${dateB[3]}${dateB[2]}${dateB[1]}` : '';
		// Inversăm ordinea comparării pentru sortare descrescătoare
		return formattedDateB.localeCompare(formattedDateA);
	});

	sortedFilesContent.forEach(file => {
		const dateMatch = file.name.match(/activitate_admini_(\d{2})-(\d{2})-(\d{4})\.txt$/);
		let dateFormatted = 'Unknown Date';
		if (dateMatch) {
			dateFormatted = `[ ${dateMatch[1]}.${dateMatch[2]}.${dateMatch[3]} ] >>`;
		}

		let regexPattern = adminName ? adminName : '';
		if (commands.length > 0) {
			regexPattern += regexPattern ? '.*?(' : '(';
			regexPattern += commands.map(cmd => `'${cmd}\\s.*?'`).join('|') + ')';
		}
		const regex = new RegExp(regexPattern, 'gi');

		file.content.split('\n').forEach(line => {
			if (regex.test(line)) {
				resultsElement.textContent += `${dateFormatted} ${line}\n`;
			}
		});
	});
}




/*function updateFileList() {
	const fileList = document.getElementById('fileList');
	fileList.innerHTML = '';
	filesContent.forEach((file, index) => {
		const li = document.createElement('li');
		li.textContent = file.name;

		const removeButton = document.createElement('button');
		removeButton.textContent = 'X';
		removeButton.onclick = function () {
			filesContent.splice(index, 1);
			updateFileList();
		};
		li.appendChild(removeButton);
		fileList.appendChild(li);
	});
	document.getElementById('fileCount').textContent = filesContent.length.toString();
}*/

function updateFileList() {
	const fileList = document.getElementById('fileList');
	fileList.innerHTML = '';
	filesContent.forEach((file, index) => {
		const li = document.createElement('li');

		const fileNameSpan = document.createElement('span');
		fileNameSpan.textContent = file.name;
		li.appendChild(fileNameSpan);

		const removeButton = document.createElement('button');
		removeButton.textContent = 'X';
		removeButton.onclick = function () {
			filesContent.splice(index, 1);
			updateFileList();
		};
		li.appendChild(removeButton);

		fileList.appendChild(li);
	});
	document.getElementById('fileCount').textContent = filesContent.length.toString();
}

document.getElementById('clearAllFiles').addEventListener('click', () => {
	filesContent = [];
	updateFileList();
});