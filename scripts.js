// scripts.js

document.addEventListener('DOMContentLoaded', () => {
    const actionSelect = document.getElementById('action-select');
    const writeTextSection = document.getElementById('write-text-section');
    const uploadFigureSection = document.getElementById('upload-figure-section');
    const uploadFileSection = document.getElementById('upload-file-section');
    const inputDataSection = document.getElementById('input-data-section');
    const figureLegendSection = document.getElementById('figure-legend-section');
    const experimentSummarySection = document.getElementById('experiment-summary-section');

    const dataInputMethod = document.getElementById('data-input-method');
    const manualDataEntrySection = document.getElementById('manual-data-entry-section');
    const csvUploadSection = document.getElementById('csv-upload-section');
    const pasteDataSection = document.getElementById('paste-data-section');
    const plotOptionsSection = document.getElementById('plot-options-section');
    const chartContainer = document.getElementById('chart-container');

    const numRowsInput = document.getElementById('num-rows');
    const createDataTableBtn = document.getElementById('create-data-table');
    const dataTableSection = document.getElementById('data-table-section');
    const dataTableBody = document.querySelector('#data-table tbody');
    const csvUpload = document.getElementById('csv-upload');
    const pasteData = document.getElementById('paste-data');
    const plotDataBtn = document.getElementById('plot-data-btn');
    const plotTypeSelect = document.getElementById('plot-type');

    const figureUpload = document.getElementById('figure-upload');
    const uploadedFigureDiv = document.getElementById('uploaded-figure');
    const fileUpload = document.getElementById('file-upload');
    const uploadedFilesDiv = document.getElementById('uploaded-files');

    const figureLegendTextarea = document.getElementById('figure-legend');
    const experimentSummaryTextarea = document.getElementById('experiment-summary');
    const saveBtn = document.getElementById('save-btn');
    const legendChecks = document.querySelectorAll('.legend-check');

    // Hide all sections initially
    hideAllSections();

    // Event listener for action selection
    actionSelect.addEventListener('change', () => {
        const selectedOptions = Array.from(actionSelect.selectedOptions).map(option => option.value);

        hideAllSections();

        // Toggle sections based on selected actions
        selectedOptions.forEach(option => {
            switch(option) {
                case 'write-text':
                    writeTextSection.classList.remove('hidden');
                    break;
                case 'upload-figure':
                    uploadFigureSection.classList.remove('hidden');
                    break;
                case 'upload-file':
                    uploadFileSection.classList.remove('hidden');
                    break;
                case 'input-data':
                    inputDataSection.classList.remove('hidden');
                    break;
                default:
                    hideAllSections();
            }
        });

        if (selectedOptions.includes('input-data')) {
            figureLegendSection.classList.remove('hidden');
            experimentSummarySection.classList.remove('hidden');
            saveBtn.classList.remove('hidden');
        }
    });

    // Event listener for data input method selection
    dataInputMethod.addEventListener('change', () => {
        const method = dataInputMethod.value;

        // Hide all data input sections initially
        manualDataEntrySection.classList.add('hidden');
        csvUploadSection.classList.add('hidden');
        pasteDataSection.classList.add('hidden');
        plotOptionsSection.classList.add('hidden');
        chartContainer.innerHTML = '';

        // Show the relevant section based on selected input method
        switch(method) {
            case 'manual':
                manualDataEntrySection.classList.remove('hidden');
                break;
            case 'csv':
                csvUploadSection.classList.remove('hidden');
                break;
            case 'paste':
                pasteDataSection.classList.remove('hidden');
                break;
            default:
                console.log("No valid method selected");
        }
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
        plotOptionsSection.classList.remove('hidden');
    });

    // Handle CSV Upload
    csvUpload.addEventListener('change', () => {
        const file = csvUpload.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const csvData = event.target.result;
                const rows = csvData.trim().split('\n').map(row => row.split(',').map(Number));
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
        plotOptionsSection.classList.remove('hidden');
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

        const plotType = plotTypeSelect.value;

        plotChart(data, col1Header, col2Header, plotType);
    });

    function plotChart(data, xLabel, yLabel, type) {
        chartContainer.innerHTML = ''; // Clear previous chart

        const canvas = document.createElement('canvas');
        chartContainer.appendChild(canvas);

        new Chart(canvas, {
            type: type === 'histogram' ? 'bar' : type,  // Use 'bar' for histogram, but change its options later
            data: {
                labels: type === 'scatter' ? data.map((_, i) => `Point ${i + 1}`) : data.map(point => point.x),
                datasets: [{
                    label: 'Data',
                    data: data.map(point => type === 'scatter' ? point : point.y),
                    borderColor: 'rgba(75, 192, 192, 1)',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                }]
            },
            options: {
                responsive: true,
                scales: {
                    x: { display: true, title: { display: true, text: xLabel || 'X-axis' } },
                    y: { display: true, title: { display: true, text: yLabel || 'Y-axis' } },
                },
                ...(type === 'histogram' && {
                    scales: {
                        x: {
                            beginAtZero: true,
                            type: 'linear',
                            title: { display: true, text: xLabel || 'X-axis' },
                        },
                        y: { beginAtZero: true, title: { display: true, text: yLabel || 'Y-axis' } }
                    }
                })
            }
        });
    }

    // Function to hide all sections initially
    function hideAllSections() {
        writeTextSection.classList.add('hidden');
        uploadFigureSection.classList.add('hidden');
        uploadFileSection.classList.add('hidden');
        inputDataSection.classList.add('hidden');
        figureLegendSection.classList.add('hidden');
        experimentSummarySection.classList.add('hidden');
        manualDataEntrySection.classList.add('hidden');
        csvUploadSection.classList.add('hidden');
        pasteDataSection.classList.add('hidden');
        plotOptionsSection.classList.add('hidden');
        dataTableSection.classList.add('hidden');
        saveBtn.classList.add('hidden');
    }

    // Enable figure legend textarea after all checks are ticked
    legendChecks.forEach(check => {
        check.addEventListener('change', () => {
            const allChecked = Array.from(legendChecks).every(check => check.checked);
            figureLegendTextarea.disabled = !allChecked;
            experimentSummaryTextarea.disabled = !allChecked;
            saveBtn.disabled = !allChecked;
        });
    });

    hideAllSections(); // Initialize the sections to be hidden
});
