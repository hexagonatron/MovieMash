const movies = Array.from(document.getElementsByClassName("movie-container"));

test = ["tt0099685","tt0133093"];

acceptAnswer = false;

var score = 0;

var movieArrayGlobal = [];


getMovies = (array) => {

    //Generate 2 unique random numbers
    do {
        var rand = [];
        rand[0] = Math.floor(Math.random() * array.length);
        rand[1] = Math.floor(Math.random() * array.length);

    } while (rand[0] == rand[1]);

    var movieObj = [];
    var urls = [];


    //generate array of api urls pulling from the movieIDs Array
    urls = rand.map(r => 'https://www.omdbapi.com/?i=' + array[r] + '&apikey=80d347c7&');

    //api call to omdb
    var promise = urls.map(url => fetch(url).then(y => y.json()));

    //after results returned feed them into fill page function and start the game
    return Promise.all(promise).then(results => {
        if (results[0].imdbRating == results[1].imdbRating){
            getMovies(movieIDs);
        } else {
            fillPage(results);
            startGame(results);
            movieArrayGlobal = results;
        }
    })
}

//Fill various parts of the page with correct info, update score, make sure hidden elements are hidden
fillPage = (movieArray) => {
    document.getElementById("score").innerText = score;
    document.getElementById("game-over").classList.add("hidden");
    document.getElementById("restart").classList.add("hidden");
    document.getElementById("instruction").classList.remove("hidden");
    
    movies.map((movie, i) => {
        movie.getElementsByClassName("flip-card-inner")[0].classList.remove("flip-left", "flip-right");
        movie.getElementsByClassName("flip-card-front")[0].classList.remove("animate-darken");
        movie.classList.add("hover");
        movie.getElementsByClassName("poster")[0].addEventListener("load", (e) => { //fill h and w of flip card once img has loaded into page
            movie.getElementsByClassName("flip-card")[0].style.height = e.target.height + "px";
            movie.getElementsByClassName("flip-card")[0].style.width = e.target.width + "px";
        })
        movie.getElementsByClassName("poster")[0].setAttribute("src", movieArray[i].Poster);
        movie.getElementsByClassName("info-title")[0].innerText = movieArray[i].Title;
        movie.getElementsByClassName("movie-year")[0].innerText = movieArray[i].Year;
        movie.getElementsByClassName("info-director")[0].innerText = movieArray[i].Director;
        movie.getElementsByClassName("info-cast")[0].innerText = movieArray[i].Actors;
        movie.getElementsByClassName("info-description")[0].innerText = movieArray[i].Plot;
    });
}

//Accept answers to true, so that when movie is clicked code is executed
startGame = (results) => {
    acceptAnswer = true;
    
}

//After game over clears score and restarts game
restartGame = () => {
    score = 0;
    getMovies(movieIDs);
}

getColour = (rating) => {
    //map imdb value 5.5 -> 8.5 to colour hue value 0 - 120
    var hue = ((Number(rating) - 5.5) / (8.5 - 5.5)) * 120;
    if (hue <= 0) hue = 0;
    if (hue >= 120) hue = 120;

    return hue;
}

//start game on page load
getMovies(movieIDs);

//adds event handling function to movie boxes
movies.forEach(movie => {
    movie.addEventListener("click", e => {
        if (acceptAnswer) {
            acceptAnswer = false; //when click detected, stop accepting further clicks
            var selected = Number(e.currentTarget.dataset["movie"]); //determine which movie was clicked
            movies.forEach((movie, i) => { //reveal imdb rating
                movie.classList.remove("hover");
                movie.getElementsByClassName("flip-card-inner")[0].classList.add((i == 0)? "flip-left" : "flip-right");
                movie.getElementsByClassName("flip-card-front")[0].classList.add("animate-darken");
                movie.getElementsByClassName("imdb-rating-value")[0].innerHTML = movieArrayGlobal[i].imdbRating;
                movie.getElementsByClassName("imdb-rating-value")[0].style.color = "hsl(" + getColour(movieArrayGlobal[i].imdbRating) + ", 100%, 36%)"; //colour text according to rating
            });
            if (movieArrayGlobal[selected].imdbRating > movieArrayGlobal[(selected + 1) % 2].imdbRating) { //if correct answer wait for 750ms, inc score and get next set of movies
                score++;
                setTimeout(() => {
                    getMovies(movieIDs);
                }, 1000);
            } else { //if wrong answer reveal game over and restart button
                document.getElementById("game-over").classList.remove("hidden");
                document.getElementById("restart").classList.remove("hidden");
                document.getElementById("instruction").classList.add("hidden");
            }
        }
    })
});

//Restart button event handler
document.getElementById("restart").addEventListener("click", e => restartGame());

var lastWinWid = window.innerWidth;

window.addEventListener("resize", (e) => {
    console.log("Curr: " + window.innerWidth + " Last: " + lastWinWid);
    if ((window.innerWidth <= 655 && lastWinWid > 655) || (window.innerWidth > 655 && lastWinWid <= 655)) {
        console.log("TRIGGERED!!!!!")
        Array.from(document.getElementsByClassName("movie-container")).map(m => {
            m.getElementsByClassName("flip-card")[0].style.height = m.getElementsByClassName("poster")[0].height + "px"

            m.getElementsByClassName("flip-card")[0].style.width = m.getElementsByClassName("poster")[0].width + "px"
        })
    }
    
    lastWinWid = window.innerWidth;
    
});