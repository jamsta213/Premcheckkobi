// ======== Show/Hide Date Fields (MOVE TO TOP, OUTSIDE DOMContentLoaded) ========
window.showDateField = function(fieldId) {
    document.getElementById(fieldId).style.display = 'block';
}

window.hideDateField = function(fieldId) {
    document.getElementById(fieldId).style.display = 'none';
    var dateInput = document.getElementById(fieldId).querySelector('input[type="date"]');
    if (dateInput) dateInput.value = '';
}

// ======== NOW the DOMContentLoaded section ========
document.addEventListener('DOMContentLoaded', () => {
    // ======== Question Display Logic ========
    const dailyRadio = document.getElementById('daily');
    const weeklyRadio = document.getElementById('weekly');
    const monthlyRadio = document.getElementById('monthly');
    const additionalRadio = document.getElementById('additional');
    const dailyTime = document.getElementById('dailyTime');
    const morningRadio = document.getElementById('morning');
    const afternoonRadio = document.getElementById('afternoon');
    const morningSet = document.getElementById('morningQuestions');
    const afternoonSet = document.getElementById('afternoonQuestions');
    const weeklySet = document.getElementById('weeklyQuestions');
    const monthlySet = document.getElementById('monthlyQuestions');
    const additionalSet = document.getElementById('additionalQuestions');

    function updateDisplay() {
        // Hide all question sets initially
        dailyTime.style.display = 'none';
        morningSet.style.display = 'none';
        afternoonSet.style.display = 'none';
        weeklySet.style.display = 'none';
        monthlySet.style.display = 'none';
        additionalSet.style.display = 'none';

        // Show questions only for the selected frequency
        if(dailyRadio.checked){
            dailyTime.style.display = 'block';
            if(morningRadio.checked) morningSet.style.display = 'block';
            else if(afternoonRadio.checked) afternoonSet.style.display = 'block';
        } else if(weeklyRadio.checked){
            weeklySet.style.display = 'block';
        } else if(monthlyRadio.checked){
            monthlySet.style.display = 'block';
        } else if(additionalRadio.checked){
            additionalSet.style.display = 'block';
        }
    }

    // Event listeners for all radios
    [dailyRadio, weeklyRadio, monthlyRadio, additionalRadio, morningRadio, afternoonRadio].forEach(radio => {
        radio.addEventListener('change', updateDisplay);
    });

    // Initialize on page load
    updateDisplay();

    // ======== Custom Popup Logic ========
    const popup = document.getElementById('success-popup');
    const closeBtn = document.getElementById('success-close');

    function closePopup() {
        popup.classList.remove('show');
    }

    closeBtn.addEventListener('click', closePopup);

    // ======== FORM SUBMISSION TO GOOGLE APPS SCRIPT ========
    const scriptURL = 'https://script.google.com/macros/s/AKfycbwD4QRvrg0RKeSoGvjD1vKK1V0NB15I6xPP51-WoW0-DosiWpn4Zx-ZN8QhYVXaw1e2Ow/exec';
    const form = document.getElementById('checklist-form');

    form.addEventListener('submit', e => {
        e.preventDefault();
        
        const formData = new FormData(form);
        const params = new URLSearchParams();
        
        for (let [key, value] of formData.entries()) {
            params.append(key, value);
        }

        fetch(scriptURL, { 
            method: 'POST', 
            body: params
        })
        .then(response => response.json())
        .then(data => {
            console.log('Response:', data);
            if(data.result === 'success') {
                popup.classList.add('show');
                
                setTimeout(() => {
                    form.reset();
                    updateDisplay();
                }, 100);
            }
            else {
                Swal.fire({
                    title: 'Error',
                    text: data.error || 'Something went wrong',
                    icon: 'error'
                });
            }
        })
        .catch(error => {
            console.error('Error:', error);
            Swal.fire({
                title: 'Error',
                text: 'Network error. Check console for details.',
                icon: 'error'
            });
        });
    });
});
