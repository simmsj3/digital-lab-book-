// scripts.js

document.addEventListener('DOMContentLoaded', () => {
    const fileUpload = document.getElementById('file-upload');
    const uploadedFilesDiv = document.getElementById('uploaded-files');
    const dataInput = document.getElementById('data-input');
    const plotDataBtn = document.getElementById('plot-data-btn');
    const chartContainer = document.getElementById('chart-container');
    const textEditor = document.getElementById('text-editor');
    const figureLegend = document.getElementById('figure-legend');
    const saveBtn = document.getElementById('save-btn');

    const fileCheckbox = document.getElementById('file-checkbox');
    const chartCheckbox = document.getElementById('chart-checkbox');
    const textCheckbox = document.getElementById('text-checkbox');
    const legendCheckbox = document.getElementById('legend-checkbox');

    // Handle file upload
    fileUpload.addEventListener('change', () => {
        const files = fileUpload.files;
        uploadedFilesDiv.innerHTML = '';

        Array.from(files).forEach(file => {
            const fileElement = document.createElement('p');
            fileElement.textContent = file.name;
            uploadedFilesDiv.appendChild(fileElement);
        });

        fileCheckbox.checked = files.length > 0;
    });

    // Handle data plotting
    plotDataBtn.addEventListener('click', () => {
        const data = dataInput.value.split(',').map(Number);

        if (data.length > 0 && !isNaN(data[0])) {
            plotChart(data);
            chartCheckbox.checked = true;
        } else {
            alert('Please enter valid comma-separated numerical data.');
        }
    });

    // Plot a simple line chart
    function plotChart(data) {
        chartContainer.innerHTML = ''; // Clear previous chart

        const canvas = document.createElement('canvas');
        chartContainer.appendChild(canvas);

        new Chart(canvas, {
            type: 'line',
            data: {
                labels: data.map((_, i) => `Point ${i + 1}`),
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
                    x: { display: true, title: { display: true, text: 'Data Points' } },
                    y: { display: true, title: { display: true, text: 'Value' } },
                }
            }
        });
    }

    // Handle text editor input
    textEditor.addEventListener('input', () => {
        textCheckbox.checked = textEditor.value.trim().length > 0;
    });

    // Handle figure legend input
    figureLegend.addEventListener('input', () => {
        legendCheckbox.checked = figureLegend.value.trim().length > 0;
    });

    // Handle save button
    saveBtn.addEventListener('click', () => {
        if (fileCheckbox.checked && chartCheckbox.checked && textCheckbox.checked && legendCheckbox.checked) {
            alert('Lab page saved successfully!');
        } else {
            alert('Please complete all sections before saving.');
        }
    });
});
