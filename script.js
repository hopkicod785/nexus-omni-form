// Form validation and interactivity
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing form...');
    
    const form = document.getElementById('nexusForm');
    const summarySection = document.getElementById('formSummary');
    const summaryContent = document.getElementById('summaryContent');
    
    console.log('Form element found:', form);
    console.log('Summary section found:', summarySection);
    console.log('Summary content found:', summaryContent);

    // Configuration - Update this email address as needed
    const CONFIG = {
        recipientEmail: 'authorization@nexusomni.com', // Change this to the actual recipient email
        subjectPrefix: 'Nexus Omni Installation Authorization Request'
    };

    // Form validation
    if (form) {
        console.log('Adding submit event listener to form...');
        form.addEventListener('submit', function(e) {
            console.log('Form submit event triggered');
            e.preventDefault();
            
            console.log('Starting form validation...');
            if (validateForm()) {
                console.log('Form validation passed, showing summary and submitting...');
                showSummary();
                submitForm();
            } else {
                console.log('Form validation failed');
            }
        });
        console.log('Submit event listener added successfully');
    } else {
        console.error('Form element not found! Cannot add event listener.');
    }

    // Real-time validation
    if (form) {
        const requiredFields = form.querySelectorAll('[required]');
        console.log('Found required fields for validation:', requiredFields.length);
        requiredFields.forEach(field => {
            field.addEventListener('blur', validateField);
            field.addEventListener('input', clearFieldError);
        });
    }

    // Date validation
    const installDate = document.getElementById('installDate');
    const neededByDate = document.getElementById('neededByDate');
    
    if (installDate && neededByDate) {
        installDate.addEventListener('change', validateDates);
        neededByDate.addEventListener('change', validateDates);
        console.log('Date validation listeners added');
    }

    // Quantity input validation
    if (form) {
        const quantityInputs = form.querySelectorAll('input[type="number"]');
        console.log('Found quantity inputs:', quantityInputs.length);
        quantityInputs.forEach(input => {
            input.addEventListener('input', function() {
                if (this.value < 0) {
                    this.value = 0;
                }
            });
        });

        // Auto-calculate totals
        quantityInputs.forEach(input => {
            input.addEventListener('input', updateTotals);
        });
    }
    
    console.log('Form initialization complete');
});

function validateForm() {
    console.log('validateForm() called');
    let isValid = true;
    const form = document.getElementById('nexusForm');
    
    // Clear previous errors
    clearAllErrors();
    
    // Validate required fields
    const requiredFields = form.querySelectorAll('[required]');
    console.log('Found required fields:', requiredFields.length);
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            console.log('Required field missing:', field.name || field.id);
            showFieldError(field, 'This field is required');
            isValid = false;
        }
    });
    
    // Validate dates
    if (!validateDates()) {
        console.log('Date validation failed');
        isValid = false;
    }
    
    // Validate acknowledgment
    const acknowledgment = document.getElementById('acknowledgment');
    if (!acknowledgment.checked) {
        console.log('Acknowledgment not checked');
        showFieldError(acknowledgment, 'You must acknowledge the terms');
        isValid = false;
    }
    
    // Check if at least one equipment item is selected
    const equipmentInputs = document.querySelectorAll('.equipment-grid input[type="number"]');
    const hasEquipment = Array.from(equipmentInputs).some(input => parseInt(input.value) > 0);
    
    if (!hasEquipment) {
        console.log('No equipment items selected');
        showGeneralError('Please specify at least one equipment item');
        isValid = false;
    }
    
    console.log('Form validation result:', isValid);
    return isValid;
}

function validateField(event) {
    const field = event.target;
    clearFieldError(event);
    
    if (field.hasAttribute('required') && !field.value.trim()) {
        showFieldError(field, 'This field is required');
        return false;
    }
    
    return true;
}

function validateDates() {
    const installDate = document.getElementById('installDate');
    const neededByDate = document.getElementById('neededByDate');
    
    if (installDate.value && neededByDate.value) {
        const install = new Date(installDate.value);
        const needed = new Date(neededByDate.value);
        
        if (needed >= install) {
            showFieldError(neededByDate, 'Needed by date must be before the install date');
            showFieldError(installDate, 'Install date must be after the needed by date');
            return false;
        }
    }
    
    return true;
}

function showFieldError(field, message) {
    clearFieldError({ target: field });
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.textContent = message;
    errorDiv.style.cssText = `
        color: #f56565;
        font-size: 0.85rem;
        margin-top: 5px;
        display: flex;
        align-items: center;
        gap: 5px;
    `;
    
    field.style.borderColor = '#f56565';
    field.parentNode.appendChild(errorDiv);
}

function clearFieldError(event) {
    const field = event.target;
    const errorDiv = field.parentNode.querySelector('.field-error');
    
    if (errorDiv) {
        errorDiv.remove();
    }
    
    field.style.borderColor = '';
}

function clearAllErrors() {
    const errorDivs = document.querySelectorAll('.field-error');
    errorDivs.forEach(div => div.remove());
    
    const fields = document.querySelectorAll('input, textarea, select');
    fields.forEach(field => {
        field.style.borderColor = '';
    });
}

function showGeneralError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'general-error';
    errorDiv.textContent = message;
    errorDiv.style.cssText = `
        background: rgba(245, 101, 101, 0.1);
        border: 1px solid #f56565;
        color: #f56565;
        padding: 15px;
        border-radius: 10px;
        margin-bottom: 20px;
        text-align: center;
        font-weight: 500;
    `;
    
    const form = document.getElementById('nexusForm');
    form.insertBefore(errorDiv, form.firstChild);
    
    setTimeout(() => {
        errorDiv.remove();
    }, 5000);
}

function showSummary() {
    const form = document.getElementById('nexusForm');
    const formData = new FormData(form);
    
    let summaryHTML = '';
    
    // Basic Information
    summaryHTML += '<div class="summary-section">';
    summaryHTML += '<h3>Basic Information</h3>';
    summaryHTML += `<div class="summary-item"><span class="summary-label">Distributor:</span><span class="summary-value">${formData.get('distributorName')}</span></div>`;
    summaryHTML += `<div class="summary-item"><span class="summary-label">Install Date:</span><span class="summary-value">${formData.get('installDate')}</span></div>`;
    summaryHTML += `<div class="summary-item"><span class="summary-label">Needed By:</span><span class="summary-value">${formData.get('neededByDate')}</span></div>`;
    summaryHTML += '</div>';
    
    // Equipment
    summaryHTML += '<div class="summary-section">';
    summaryHTML += '<h3>Equipment</h3>';
    
    const equipmentItems = [
        { key: 'nexusQuantity', label: 'Nexus' },
        { key: 'sensorPowerUnitQuantity', label: 'Sensor Power Unit' },
        { key: 'type1SensorQuantity', label: 'Type 1 Sensor' },
        { key: 'type2SensorQuantity', label: 'Type 2 Sensor' }
    ];
    
    equipmentItems.forEach(item => {
        const quantity = parseInt(formData.get(item.key)) || 0;
        if (quantity > 0) {
            summaryHTML += `<div class="summary-item"><span class="summary-label">${item.label}:</span><span class="summary-value">${quantity}</span></div>`;
        }
    });
    
    summaryHTML += '</div>';
    
    // Accessories
    summaryHTML += '<div class="summary-section">';
    summaryHTML += '<h3>Accessories</h3>';
    
    const accessoryItems = [
        { key: 'shelfMountKitQuantity', label: 'Shelf Mount Kit' },
        { key: 'rackMountKitQuantity', label: '19" Rack Mount Kit' },
        { key: 'wifiRepeaterQuantity', label: 'WiFi Repeater' },
        { key: 'c1HarnessQuantity', label: 'C1 Harness' }
    ];
    
    let hasAccessories = false;
    accessoryItems.forEach(item => {
        const quantity = parseInt(formData.get(item.key)) || 0;
        if (quantity > 0) {
            summaryHTML += `<div class="summary-item"><span class="summary-label">${item.label}:</span><span class="summary-value">${quantity}</span></div>`;
            hasAccessories = true;
        }
    });
    
    if (!hasAccessories) {
        summaryHTML += '<div class="summary-item"><span class="summary-label">Accessories:</span><span class="summary-value">None</span></div>';
    }
    
    summaryHTML += '</div>';
    
    // Contact Information
    summaryHTML += '<div class="summary-section">';
    summaryHTML += '<h3>Contact Information</h3>';
    summaryHTML += `<div class="summary-item"><span class="summary-label">RSM:</span><span class="summary-value">${formData.get('rsm')}</span></div>`;
    summaryHTML += '</div>';
    
    // Invoice Information
    if (formData.get('invoiceNumber')) {
        summaryHTML += '<div class="summary-section">';
        summaryHTML += '<h3>Invoice Information</h3>';
        summaryHTML += `<div class="summary-item"><span class="summary-label">Invoice Number:</span><span class="summary-value">${formData.get('invoiceNumber')}</span></div>`;
        summaryHTML += '</div>';
    }
    
    // Additional Notes
    if (formData.get('additionalNotes')) {
        summaryHTML += '<div class="summary-section">';
        summaryHTML += '<h3>Additional Notes</h3>';
        summaryHTML += `<div class="summary-item"><span class="summary-label">Notes:</span><span class="summary-value">${formData.get('additionalNotes')}</span></div>`;
        summaryHTML += '</div>';
    }
    
    summaryContent.innerHTML = summaryHTML;
    summarySection.style.display = 'block';
    
    // Scroll to summary
    summarySection.scrollIntoView({ behavior: 'smooth' });
}

async function submitForm() {
    console.log('submitForm() called');
    const form = document.getElementById('nexusForm');
    const formData = new FormData(form);
    
    // Convert FormData to object
    const submissionData = {};
    for (let [key, value] of formData.entries()) {
        submissionData[key] = value;
    }
    
    // Add acknowledgment as boolean
    submissionData.acknowledgment = formData.get('acknowledgment') === 'on';
    
    console.log('Submission data:', submissionData);
    
    try {
        // Show loading state
        const submitButton = document.querySelector('button[type="submit"]');
        const originalText = submitButton.innerHTML;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
        submitButton.disabled = true;
        
        console.log('Sending request to /api/submit');
        
        // Submit to backend
        const response = await fetch('/api/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(submissionData)
        });
        
        console.log('Response received:', response.status);
        const result = await response.json();
        console.log('Response data:', result);
        
        if (result.success) {
            console.log('Submission successful');
            showSubmissionSuccess(result.submissionId);
        } else {
            console.log('Submission failed:', result.error);
            showSubmissionError(result.error);
        }
        
    } catch (error) {
        console.error('Submission error:', error);
        showSubmissionError('Failed to submit form. Please try again.');
    } finally {
        // Reset button
        const submitButton = document.querySelector('button[type="submit"]');
        submitButton.innerHTML = originalText;
        submitButton.disabled = false;
    }
}

function createEmailContent(formData) {
    const currentDate = new Date().toLocaleDateString();
    const currentTime = new Date().toLocaleTimeString();
    
    let emailContent = `NEXUS OMNI INSTALLATION AUTHORIZATION REQUEST
===============================================

Submitted by: ${formData.get('rsm')} (RSM)
Submission Date: ${currentDate} at ${currentTime}

BASIC INFORMATION
-----------------
Distributor Name: ${formData.get('distributorName')}
Install Date: ${formData.get('installDate')}
Equipment Needed By: ${formData.get('neededByDate')}

EQUIPMENT REQUIREMENTS
----------------------
Nexus: ${formData.get('nexusQuantity') || 0}
Sensor Power Unit: ${formData.get('sensorPowerUnitQuantity') || 0}
Type 1 Sensor: ${formData.get('type1SensorQuantity') || 0}
Type 2 Sensor: ${formData.get('type2SensorQuantity') || 0}

ACCESSORIES
-----------
Shelf Mount Kit: ${formData.get('shelfMountKitQuantity') || 0}
19" Rack Mount Kit: ${formData.get('rackMountKitQuantity') || 0}
WiFi Repeater: ${formData.get('wifiRepeaterQuantity') || 0}
C1 Harness: ${formData.get('c1HarnessQuantity') || 0}

CONTACT INFORMATION
-------------------
Regional Sales Manager: ${formData.get('rsm')}

INVOICE INFORMATION
-------------------
Invoice Number: ${formData.get('invoiceNumber') || 'Not provided'}

ADDITIONAL NOTES
----------------
${formData.get('additionalNotes') || 'None'}

ACKNOWLEDGMENT
--------------
✓ I acknowledge that I have reviewed the equipment requirements and installation specifications.
✓ I understand that this authorization is subject to approval and availability of equipment.

---
This form was submitted via the Nexus Omni Installation Authorization Form.
Please review and respond with approval status.

Thank you,
${formData.get('rsm')}
Regional Sales Manager`;

    return emailContent;
}

function showSubmissionSuccess(submissionId) {
    const successDiv = document.createElement('div');
    successDiv.className = 'submission-success';
    successDiv.innerHTML = `
        <div style="
            background: rgba(16, 185, 129, 0.1);
            border: 1px solid #10b981;
            color: #10b981;
            padding: 25px;
            border-radius: 12px;
            margin-bottom: 20px;
            text-align: center;
        ">
            <i class="fas fa-check-circle" style="font-size: 2rem; margin-bottom: 15px; display: block;"></i>
            <h3 style="margin-bottom: 15px; color: #10b981;">Authorization Request Submitted Successfully!</h3>
            <p style="margin-bottom: 20px; color: #cbd5e1;">
                Your Nexus Omni installation authorization request has been submitted and is now pending review.
            </p>
            
            <div style="
                background: rgba(0, 0, 0, 0.2);
                border-radius: 8px;
                padding: 15px;
                margin-top: 20px;
                text-align: left;
                font-size: 0.9rem;
                color: #94a3b8;
            ">
                <strong>Submission ID:</strong> ${submissionId}<br>
                <strong>Status:</strong> Pending Review<br>
                <strong>Submitted:</strong> ${new Date().toLocaleString()}
            </div>
            
            <div style="margin-top: 20px;">
                <button onclick="printForm()" style="
                    background: #3b82f6;
                    color: white;
                    border: none;
                    padding: 10px 20px;
                    border-radius: 6px;
                    font-weight: 500;
                    cursor: pointer;
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                    font-family: inherit;
                    margin-right: 10px;
                ">
                    <i class="fas fa-print"></i> Print Copy
                </button>
                
                <button onclick="resetForm()" style="
                    background: #6b7280;
                    color: white;
                    border: none;
                    padding: 10px 20px;
                    border-radius: 6px;
                    font-weight: 500;
                    cursor: pointer;
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                    font-family: inherit;
                ">
                    <i class="fas fa-plus"></i> New Request
                </button>
            </div>
        </div>
    `;
    
    const form = document.getElementById('nexusForm');
    form.insertBefore(successDiv, form.firstChild);
    
    // Scroll to success message
    successDiv.scrollIntoView({ behavior: 'smooth' });
}

function showSubmissionError(errorMessage) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'submission-error';
    errorDiv.innerHTML = `
        <div style="
            background: rgba(239, 68, 68, 0.1);
            border: 1px solid #ef4444;
            color: #ef4444;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 20px;
            text-align: center;
        ">
            <i class="fas fa-exclamation-triangle" style="font-size: 1.5rem; margin-bottom: 10px; display: block;"></i>
            <h3 style="margin-bottom: 10px; color: #ef4444;">Submission Failed</h3>
            <p style="color: #cbd5e1; margin-bottom: 15px;">${errorMessage}</p>
            <button onclick="this.parentElement.parentElement.remove()" style="
                background: #ef4444;
                color: white;
                border: none;
                padding: 8px 16px;
                border-radius: 6px;
                font-weight: 500;
                cursor: pointer;
                font-family: inherit;
            ">
                Dismiss
            </button>
        </div>
    `;
    
    const form = document.getElementById('nexusForm');
    form.insertBefore(errorDiv, form.firstChild);
    
    // Scroll to error message
    errorDiv.scrollIntoView({ behavior: 'smooth' });
}

function openEmailClient(mailtoLink) {
    window.location.href = mailtoLink;
}

function copyEmailContent() {
    if (navigator.clipboard && window.emailContentToCopy) {
        navigator.clipboard.writeText(window.emailContentToCopy).then(() => {
            showCopySuccess();
        }).catch(() => {
            fallbackCopyTextToClipboard(window.emailContentToCopy);
        });
    } else {
        fallbackCopyTextToClipboard(window.emailContentToCopy);
    }
}

function fallbackCopyTextToClipboard(text) {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.position = "fixed";
    textArea.style.opacity = "0";
    
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        document.execCommand('copy');
        showCopySuccess();
    } catch (err) {
        console.error('Fallback: Could not copy text: ', err);
        alert('Could not copy to clipboard. Please select and copy the text manually.');
    }
    
    document.body.removeChild(textArea);
}

function showCopySuccess() {
    const successDiv = document.createElement('div');
    successDiv.innerHTML = `
        <div style="
            background: rgba(72, 187, 120, 0.2);
            border: 1px solid #48bb78;
            color: #48bb78;
            padding: 15px;
            border-radius: 10px;
            margin: 10px 0;
            text-align: center;
            font-weight: 500;
        ">
            <i class="fas fa-check"></i> Email content copied to clipboard!
        </div>
    `;
    
    const submissionOptions = document.querySelector('.submission-options');
    if (submissionOptions) {
        submissionOptions.appendChild(successDiv);
        
        setTimeout(() => {
            successDiv.remove();
        }, 3000);
    }
}

function resetForm() {
    if (confirm('Are you sure you want to reset the form? All data will be lost.')) {
        document.getElementById('nexusForm').reset();
        document.getElementById('formSummary').style.display = 'none';
        clearAllErrors();
        
        // Clear any success/error messages and submission options
        const successMessages = document.querySelectorAll('.success-message, .submission-success');
        successMessages.forEach(msg => msg.remove());
        
        const errorMessages = document.querySelectorAll('.submission-error');
        errorMessages.forEach(msg => msg.remove());
        
        const submissionOptions = document.querySelector('.submission-options');
        if (submissionOptions) {
            submissionOptions.remove();
        }
    }
}

function printForm() {
    // Show summary if not already shown
    if (document.getElementById('formSummary').style.display === 'none') {
        if (validateForm()) {
            showSummary();
        } else {
            alert('Please fill in all required fields before printing.');
            return;
        }
    }
    
    // Print the form
    window.print();
}

function updateTotals() {
    // This function can be expanded to show running totals
    // For now, it's a placeholder for future enhancements
}

// Add some CSS for the summary sections
const style = document.createElement('style');
style.textContent = `
    .summary-section {
        margin-bottom: 25px;
        padding: 20px;
        background: rgba(255, 255, 255, 0.02);
        border-radius: 10px;
        border: 1px solid rgba(255, 255, 255, 0.05);
    }
    
    .summary-section h3 {
        color: #667eea;
        margin-bottom: 15px;
        font-size: 1.2rem;
        font-weight: 600;
        border-bottom: 1px solid rgba(102, 126, 234, 0.2);
        padding-bottom: 8px;
    }
    
    .summary-item {
        display: flex;
        justify-content: space-between;
        padding: 8px 0;
        border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    }
    
    .summary-item:last-child {
        border-bottom: none;
    }
    
    .summary-label {
        font-weight: 500;
        color: #a0aec0;
        flex: 1;
    }
    
    .summary-value {
        color: #e2e8f0;
        font-weight: 400;
        text-align: right;
        flex: 1;
    }
`;
document.head.appendChild(style);
