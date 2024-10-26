document.addEventListener('DOMContentLoaded', function() {
    // Section Navigation
    const homeSection = document.getElementById('home-section');
    const reserveSection = document.getElementById('reserve-section');
    const pricingSection = document.getElementById('pricing-section');
    const locationSection = document.getElementById('location-section');
    const carsSection = document.getElementById('cars-section');
    const sections = [homeSection, reserveSection, pricingSection, locationSection, carsSection];

    function showSection(section) {
        sections.forEach(sec => sec.classList.add('hidden'));
        section.classList.remove('hidden');
    }

    document.getElementById('home').addEventListener('click', () => showSection(homeSection));
    document.getElementById('reserve').addEventListener('click', () => showSection(reserveSection));
    document.getElementById('pricing').addEventListener('click', () => showSection(pricingSection));
    document.getElementById('location').addEventListener('click', () => showSection(locationSection));
    document.getElementById('cars').addEventListener('click', () => showSection(carsSection));

    // Login Popup Handling
    let loginType = ''; // Variable to store the selected login type

    // Open login popup when login button is clicked
    document.querySelector('.btn').addEventListener('click', function() {
        document.getElementById('loginPopup').style.display = 'flex';
    });

    // Close login popup
    function closePopup() {
        document.getElementById('loginPopup').style.display = 'none';
        document.getElementById('loginForm').style.display = 'none'; // Hide form when closing
    }

    // Select login type and show the form
    window.selectLoginType = function(type) {
        loginType = type; // Set login type (member or staff)
        document.getElementById('loginForm').style.display = 'block';
        document.getElementById('loginTypeTitle').textContent = type === 'member' ? 'Login as Member' : 'Login as Staff';
    };

    // Handle login form submission
    window.handleLogin = function(event) {
        event.preventDefault(); // Prevent form submission

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        // Validate username as email
        if (!username.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
            alert('Please enter a valid email address.');
            return false;
        }

        if (password === "") {
            alert('Please enter your password.');
            return false;
        }
        
        // Redirect based on login type
        if (loginType === 'member') {
            scrollToReserve(); // Redirect to reservation page
        } else if (loginType === 'staff') {
            window.location.href = 'inspection.html'; // Redirect to inspection page
        }

        closePopup(); // Close popup after login
        return true;
    };

    // Make the closePopup function available globally
    window.closePopup = closePopup;

    // Scroll to Reserve Section
    window.scrollToReserve = function() {
        showSection(reserveSection); // First, show the reserve section
        reserveSection.scrollIntoView({ behavior: 'smooth' }); // Then, scroll to it
    };

    // Add the event listener for the "Reserve Now" button
    document.querySelector('.r-btn').addEventListener('click', scrollToReserve);

    // Function to calculate return date
    function calculateReturnDate() {
        const startDateInput = document.getElementById("start-date");
        const durationInput = document.getElementById("duration");
        const durationTypeSelect = document.getElementById("duration-type");
        const returnDateInput = document.getElementById("return-date");

        const startDateValue = startDateInput.value;
        const durationValue = parseInt(durationInput.value, 10);
        const durationType = durationTypeSelect.value;

        // Ensure valid inputs before calculating
        if (!startDateValue || isNaN(durationValue) || durationValue <= 0) {
            returnDateInput.value = ""; // Clear return date if inputs are invalid
            return;
        }

        // Calculate the return date
        const startDate = new Date(startDateValue);
        let returnDate;

        switch (durationType) {
            case "Days":
                returnDate = new Date(startDate.setDate(startDate.getDate() + durationValue));
                break;
            case "Weeks":
                returnDate = new Date(startDate.setDate(startDate.getDate() + durationValue * 7));
                break;
            case "Months":
                returnDate = new Date(startDate.setMonth(startDate.getMonth() + durationValue));
                break;
        }

        // Format the return date as YYYY-MM-DD
        const formattedReturnDate = returnDate.toISOString().split('T')[0];
        returnDateInput.value = formattedReturnDate;
    }

    // Attach event listeners to the input fields
    document.getElementById("start-date").addEventListener("change", calculateReturnDate);
    document.getElementById("duration").addEventListener("input", calculateReturnDate);
    document.getElementById("duration-type").addEventListener("change", calculateReturnDate);

    document.getElementById("reservation-form").addEventListener("submit", function (event) {
        event.preventDefault(); // Prevent default form submission

        // Gather form data
        const reservationDetails = {
            name: document.getElementById("name").value,
            address: document.getElementById("address").value,
            passportId: document.getElementById("passport-id").value,
            email: document.getElementById("email").value,
            mobile: document.getElementById("mobile").value,
            carType: document.getElementById("car-type").value,
            startDate: document.getElementById("start-date").value,
            duration: document.getElementById("duration").value,
            durationType: document.getElementById("duration-type").value,
            returnDate: document.getElementById("return-date").value,
            creditCard: "**** **** **** " + document.getElementById("credit-card").value.slice(-4), // Masked CC info
        };

        // Store details in localStorage
        localStorage.setItem("reservationDetails", JSON.stringify(reservationDetails));

        // Redirect to payment page
        window.location.href = "payment.html";
        
        // Clear the form fields
        event.target.reset();
    });
   
});

function initMaps() {
    // Branch 1 location: Orchard Road
    const branch1 = [1.3033, 103.8321]; // Orchard Road
    const map1 = L.map('map1').setView(branch1, 15);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
    }).addTo(map1);
    L.marker(branch1).addTo(map1).bindPopup('Branch 1: Orchard Road').openPopup();

    // Branch 2 location: Changi Airport
    const branch2 = [1.3644, 103.9915]; // Changi Airport
    const map2 = L.map('map2').setView(branch2, 15);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
    }).addTo(map2);
    L.marker(branch2).addTo(map2).bindPopup('Branch 2: Changi Airport').openPopup();

    // Return Car Park location: East Coast Park
    const returnPark = [1.3038, 103.9225]; // East Coast Park
    const map3 = L.map('map3').setView(returnPark, 15);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
    }).addTo(map3);
    L.marker(returnPark).addTo(map3).bindPopup('Designated Return Car Park: East Coast Park').openPopup();
}

// Call the initMaps function when the window loads
window.onload = initMaps;
