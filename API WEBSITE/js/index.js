//Author @ Bryn Jones 2024
window.addEventListener("load", function (evt) { //Opens 'Load'
    //Variables
    var form = document.querySelector('#form');
    form.addEventListener('submit', async function (evt) { //Opens submit
        evt.preventDefault();
        //Variables
        const searchBar = document.querySelector('#search');
        var searchTerm = searchBar.value.trim();
        const results = document.querySelector('#results');
        const hint_search = document.querySelector('#hint_search');
        const errorMessage = document.querySelector('#errorMessage');
        const loading = document.querySelector('#loading');
        const emptyResults = document.querySelector('#emptyResults')
        const noMatches = document.querySelector('#noMatches')
        //Hint
        if (searchTerm === '') {
            hint_search.style.display = 'inline';
        }
        else {//Opens Else
            results.style.display = 'none';
            //Shows loading gif
            loading.style.display = 'block';
            //Checks to see if error is present and removes error
            if(errorMessage.style.display = 'block'){
                errorMessage.style.display = 'none';
            };
            //Removes Previous Results
            while (results.firstChild) {
                results.removeChild(results.firstChild);
            };
            try {//Opens try
                // Fetch and JSON request handling
                const jsonString = await fetch('https://api.vam.ac.uk/v2/objects/search?images=true&q=' + encodeURIComponent(searchTerm));
                const jsonObject = await jsonString.json();
                //Hides loading
                loading.style.display = 'none';
                if (jsonObject.records.length == 0) { //uses pages instead of page_size //works if I use pages?
                    emptyResults.style.display = 'block';
                    noMatches.textContent = 'There are no matches for: ' + searchTerm;
                }
                else {
                    //Shows results
                    results.style.display = 'block';
                    //For of loop that setsAttributes and adds the Results to the webpage    
                    for (record of jsonObject.records) { //Opens For of
                        //Declaring Image and attributes
                        const img = document.createElement('img');
                        img.className = 'img'
                        const title = document.createElement('title');
                        title.className = 'title'
                        const date = document.createElement('date');
                        date.className = 'date'
                        const baseURL = record._images._iiif_image_base_url;
                        img.setAttribute('src', baseURL + 'full/600,400/0/default.jpg');
                        img.setAttribute('alt', record._primaryTitle);
                        //While the image is loading show loading gif
                        while (img === 'load') {
                            img.addEventListener('load', function (evt) {
                                img.setAttribute('src', "images/loading.gif")
                            });
                        }
                        //Error handling
                        img.addEventListener('error', function (evt) {
                            //Uses Placeholder if no image
                            img.setAttribute('src', "images/placeholder.jpg")
                        });
                        if (record._primaryTitle) {
                            title.textContent = "Title: " + record._primaryTitle;
                        }else{
                            title.textContent = "No title."
                        }
                        if (record._primaryDate) {
                            date.textContent = "Date: " + record._primaryDate;
                        }else{
                            date.textContent = "Date: Unknown."
                        }
                        //Creating Container for Image
                        const imgContainer = document.createElement('image-wrapper');
                        imgContainer.className = 'image-wrapper';
                        //Adding classes to the img container
                        imgContainer.appendChild(img);
                        imgContainer.appendChild(title);
                        imgContainer.appendChild(date);
                        results.appendChild(imgContainer);
                    } //Closes For of
                };
            }//Closes try
            catch (error) { //Opens Catch
                results.style.display = 'none';
                loading.style.display = 'none';
                errorMessage.style.display = 'block';
            }; //Closes Catch
        };//Closes Else
    }); //Closes submit
});//Closes 'Load'
