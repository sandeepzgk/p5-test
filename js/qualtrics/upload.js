// upload.js

async function uploadFile(file) {
    const apiToken = 'YOUR_API_TOKEN';
    const surveyId = 'YOUR_SURVEY_ID';
    const baseUrl = `https://usc.qualtrics.com/API/v3/surveys/${surveyId}/files`;

    if (!file) {
        alert('Please select a file to upload');
        return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await fetch(baseUrl, {
            method: 'POST',
            headers: {
                'x-api-token': apiToken
            },
            body: formData
        });
        
        if (!response.ok) {
            throw new Error('File upload failed');
        }

        const data = await response.json();
        console.log('Success:', data);
        alert('File uploaded successfully');
    } catch (error) {
        console.error('Error:', error);
        alert('Error in file upload');
    }
}

// Function to upload runs that haven't been uploaded yet
async function uploadNewRuns() {
    const gameRuns = gameRunManager.getAllRuns();
    const uploadedRuns = JSON.parse(localStorage.getItem('uploadedRuns')) || [];
    let jsonData = [];

    for (const run of gameRuns) {
        if (!uploadedRuns.includes(run.runNumber)) {
            jsonData.push(run);
            uploadedRuns.push(run.runNumber);
        }
    }

    const base64String = await compressJsonToZipBase64(jsonData);
    localStorage.setItem('uploadedRuns', JSON.stringify(uploadedRuns));

    // Upload JSON data as file
    const jsonDataFile = new File([base64String], 'myData.json', { type: 'application/json' });
    await uploadFile(jsonDataFile);

    // Hide the submit button after all chunks are sent
    document.getElementById('submit-button').style.display = 'none';
}

// Check and toggle submit button visibility based on new runs
function toggleSubmitButtonVisibility() {
    const gameRuns = gameRunManager.getAllRuns(); // Assuming this function exists and returns all game runs
    const uploadedRuns = JSON.parse(localStorage.getItem('uploadedRuns')) || [];
    const newRunsExist = gameRuns.some(run => !uploadedRuns.includes(run.runNumber));

    const submitButtonContainer = document.getElementById('submit-button');
    if (newRunsExist) {
        submitButtonContainer.style.display = 'block';
    } else {
        submitButtonContainer.style.display = 'none';
    }
}

// Example usage to upload new runs when the submit button is clicked
document.getElementById('submit-button').addEventListener('click', () => {
    uploadNewRuns();
});

// Call toggleSubmitButtonVisibility to initially toggle button visibility
toggleSubmitButtonVisibility();
