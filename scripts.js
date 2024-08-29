// scripts.js

// scripts.js

document.addEventListener('DOMContentLoaded', () => {
    const actionSelect = document.getElementById('action-select');
    const writeTextSection = document.getElementById('write-text-section');
    const uploadFigureSection = document.getElementById('upload-figure-section');
    const uploadFileSection = document.getElementById('upload-file-section');
    const inputDataSection = document.getElementById('input-data-section');
    const figureLegendSection = document.getElementById('figure-legend-section');

    // Initially hide all sections
    hideAllSections();

    actionSelect.addEventListener('change', () => {
        const selectedOptions = Array.from(actionSelect.selectedOptions).map(option => option.value);

        hideAllSections();

        // Toggle sections based on selected actions
        selectedOptions.forEach(option => {
            switch(option) {
                case 'write-text':
                    writeTextSection.classList.remove('hidden');
                    figureLegendSection.classList.remove('hidden');
                    break;
                case 'upload-figure':
                    uploadFigureSection.classList.remove('hidden');
                    figureLegendSection.classList.remove('hidden');
                    break;
                case 'upload-file':
                    uploadFileSection.classList.remove('hidden');
                    figureLegendSection.classList.remove('hidden');
                    break;
                case 'input-data':
                    inputDataSection.classList.remove('hidden');
                    figureLegendSection.classList.remove('hidden');
                    break;
                default:
                    hideAllSections();
            }
        });
    });

    // Function to hide all sections initially
    function hideAllSections() {
        writeTextSection.classList.add('hidden');
        uploadFigureSection.classList.add('hidden');
        uploadFileSection.classList.add('hidden');
        inputDataSection.classList.add('hidden');
        figureLegendSection.classList.add('hidden');
    }

    // Handle other functionalities like figure upload, file upload, data input, etc.
    // The rest of the code remains the same.
});


    // Handle figure upload
    figureUpload.addEventListener('change', () => {
        const file = figureUpload.files[0];
        if (file) {
            const img = document.createElement('img');
            img.src = URL.createObjectURL(file);
            img.alt = 'Uploaded Figure';
            img.style.maxWidth = '100%';
            uploadedFigureDiv.innerHTML = '';
            uploadedFigureDiv.appendChild(img);
        }
    });

    // Handle file upload
    fileUpload.addEventListener('change', () => {
        const files = fileUpload.files;
        uploadedFilesDiv.innerHTML = '';

        Array.from(files).forEach(file => {
            const fileElement = document.createElement('p');
            fileElement.textContent = file.name;
            uploadedFilesDiv.appendChild(fileElement);
        });
    });

    // Create data table based on number of rows
    createDataTableBtn.addEventListener('click', () => {
        const numRows = parseInt(numRowsInput.value, 10);
        dataTableBody.innerHTML = '';

        for (let i = 0; i < numRows; i++) {
            const row = document.createElement('tr');
            const cell1 = document.createElement('td');
            const cell2 = document.createElement('td');
            const input1 = document.createElement('input');
            const input2 = document.createElement('input');

            input1.type = 'number';
            input2.type = 'number';

            cell1.appendChild(input1);
            cell2.appendChild(input2);
            row.appendChild(cell1);
            row.appendChild(cell2);
            dataTableBody.appendChild(row);
        }

        dataTableSection.classList.remove('hidden');
    });

    // Handle CSV Upload
    csvUpload.addEventListener('change', () => {
        const file = csvUpload.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const csvData = event.target.result;
                const rows = csvData.split('\n').map(row => row.split(',').map(Number));
                populateDataTable(rows);
            };
            reader.readAsText(file);
        }
    });

    // Handle Paste Data
    pasteData.addEventListener('input', () => {
        const rows = pasteData.value.trim().split('\n').map(row => row.split('\t').map(Number));
        populateDataTable(rows);
    });

    function populateDataTable(rows) {
        dataTableBody.innerHTML = '';
        rows.forEach(row => {
            const tr = document.createElement('tr');
            row.forEach(value => {
                const td = document.createElement('td');
                const input = document.createElement('input');
                input.type = 'number';
                input.value = value;
                td.appendChild(input);
                tr.appendChild(td);
            });
            dataTableBody.appendChild(tr);
        });
        dataTableSection.classList.remove('hidden');
    }

    // Plot Data
    plotDataBtn.addEventListener('click', () => {
        const col1Header = document.getElementById('col1-header').value;
        const col2Header = document.getElementById('col2-header').value;
        const data = Array.from(dataTableBody.rows).map(row => {
            return {
                x: parseFloat(row.cells[0].querySelector('input').value),
                y: parseFloat(row.cells[1].querySelector('input').value),
            };
        });

        plotChart(data, col1Header, col2Header);
    });

    function plotChart(data, xLabel, yLabel) {
        chartContainer.innerHTML = ''; // Clear previous chart

        const canvas = document.createElement('canvas');
        chartContainer.appendChild(canvas);

        new Chart(canvas, {
            type: 'scatter',
            data: {
                datasets: [{
                    label: 'Data',
                    data: data,
                    borderColor: 'rgba(75, 192, 192, 1)',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                }]
            },
            options: {
                responsive: true,
                scales: {
                    x: { display: true, title: { display: true, text: xLabel || 'X-axis' } },
                    y: { display: true, title: { display: true, text: yLabel || 'Y-axis' } },
                }
            }
        });
    }
});
