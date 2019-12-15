const movies = Array.from(document.getElementsByClassName("movie-container"));

test = ["tt0099685","tt0133093"];

acceptAnswer = false;

var score = 0;

var movieArrayGlobal = [];

//Generate random numbers

getMovies = (array) => {

    do {
        var rand = [];
        rand[0] = Math.floor(Math.random() * array.length);
        rand[1] = Math.floor(Math.random() * array.length);

        console.log(rand);

    } while (rand[0] == rand[1]);

    var movieObj = [];
    var urls = [];



    urls = rand.map(r => 'https://www.omdbapi.com/?i=' + array[r] + '&apikey=80d347c7&');

    var promise = urls.map(url => fetch(url).then(y => y.json()));

    return Promise.all(promise).then(results => {
        console.log(results);
        if (results[0].imdbRating == results[1].imdbRating){
            getMovies(movieIDs);
        } else {
            fillPage(results);
            startGame(results);
            console.log(results);
            movieArrayGlobal = results;
        }
    })
}

fillPage = (movieArray) => {
    movies.map((movie, i) => {
        document.getElementById("score").innerText = score;
        movie.getElementsByClassName("imdb-rating")[0].classList.add("hidden");
        document.getElementById("game-over").classList.add("hidden");
        document.getElementById("instruction").classList.remove("hidden");
        movie.getElementsByClassName("poster")[0].setAttribute("src", movieArray[i].Poster);
        movie.getElementsByClassName("info-title")[0].innerText = movieArray[i].Title;
        movie.getElementsByClassName("movie-year")[0].innerText = movieArray[i].Year;
        movie.getElementsByClassName("info-director")[0].innerText = movieArray[i].Director;
        movie.getElementsByClassName("info-cast")[0].innerText = movieArray[i].Actors;
        movie.getElementsByClassName("info-description")[0].innerText = movieArray[i].Plot;
    });
}

startGame = (results) => {
    acceptAnswer = true;
    console.log(results[0].imdbRating + ", " + results[1].imdbRating);
    
}

restartGame = () => {
    console.log("score: " + score);
    score = 0;
    console.log("score: " + score);
    getMovies(movieIDs);
}

getMovies(movieIDs);

movies.forEach(movie => {
    movie.addEventListener("click", e => {
        if (acceptAnswer) {
            acceptAnswer = false;
            var selected = Number(e.currentTarget.dataset["movie"]);
            movies.forEach((movie, i) => {
                movie.getElementsByClassName("hidden")[0].classList.remove("hidden");
                movie.getElementsByClassName("imdb-rating-value")[0].innerHTML = movieArrayGlobal[i].imdbRating;
            });
            console.log(movieArrayGlobal[0].imdbRating + ", " + movieArrayGlobal[1].imdbRating);
            console.log(selected);
            if (movieArrayGlobal[selected].imdbRating > movieArrayGlobal[(selected + 1) % 2].imdbRating) {
                console.log("Winning!");
                score++;
                setTimeout(() => {
                    getMovies(movieIDs);
                }, 750);
            } else {
                console.log("You Lose. =(");
                document.getElementById("game-over").classList.remove("hidden");
                document.getElementById("instruction").classList.add("hidden");
            }
        }
    })
});

document.getElementById("restart").addEventListener("click", e => restartGame());