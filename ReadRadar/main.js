
document.addEventListener('DOMContentLoaded', function() {
    document.querySelector('#addItemLink').addEventListener('click', function(event) {
        event.preventDefault();
        document.querySelector('#popupForm').style.display = 'block';
    });

    document.querySelector('#uploadItemForm').addEventListener('submit', function(event) {
        event.preventDefault();
        
        const title = document.querySelector('#title').value;
        const author = document.querySelector('#author').value;
        const genre = document.querySelector('#genre').value;
        const price = document.querySelector('#price').value;
        const description = document.querySelector('#description').value;
        const cover = document.querySelector('#cover').files[0];
        
        // Use FileReader to read the selected file (cover image)
        if (cover) {
            const reader = new FileReader();
            reader.onload = function(e) {
                createBookCard(e.target.result, title, author, price, description, genre);
            };
            reader.readAsDataURL(cover); // Converts the file into a data URL
        } else {
            createBookCard('', title, author, price, description, genre); // No cover image provided
        }

        // Close the form
        document.querySelector('#popupForm').style.display = 'none';
    });
});

function createBookCard(coverImageUrl, title, author, price, description, genre) {
    const card = document.createElement('div');
    card.className = 'inner-card';
    
    card.innerHTML = `
        <img src="${coverImageUrl || 'default-cover-image-path.jpg'}" alt="${title}">
        <p>Title: ${title}</p>
        <p>Author: ${author}</p>
        <p>Price: $${price}</p>
        <p>Description: ${description}</p>
        <button id="Add">Add</button>
    `;

    // Assume the genre translates to an ID - customize this as needed
    const section = document.querySelector(`#${genre.replace(/\s+/g, '-')}`) || document.querySelector('#2024-Books');
    section.appendChild(card);

}
