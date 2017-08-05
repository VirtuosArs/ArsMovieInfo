$(document).ready(() => {
  $('#searchForm').keyup('submit', (e) => {
    let searchText = $('#searchText').val();
    getMovies(searchText);
    e.preventDefault();
  });
});

function getMovies(searchText){
  axios.get('https://api.themoviedb.org/3/search/movie?api_key=fa155f635119344d33fcb84fb807649b&query='+searchText)
    .then(function (response) {
      console.log(response);
      let movies = response.data.results;
      let output = '';
      $.each(movies, function(index, movie) {
            output += '<div class="col-md-3 movie-result">';
            output +=   '<div class="well text-center">';
            output +=           '<img onerror="handleMissingImg(this);" src="http://image.tmdb.org/t/p/w185/'+movie.poster_path+'">';
            output +=       '<h5>'+ movie.title+'</h5>';
            output +=       '<a onclick="movieSelected('+movie.id+')" class="btn btn-primary" href="#">Movie Details</a>';
            output +=   '</div>';
            output += '</div>';
      });

      if ( movies.length > 0 ) {
            $('#movies').html(output);
        } else {
            $('#movies').html('<div class="col-md-8 col-md-offset-2 movie-result text-center"><div class="alert alert-warning" role="alert"><strong><h4>Sorry </strong> Result for '+searchText+' not found!</h4></div></div>');
        }

    })
    .catch(function (error) {
            console.log(error);
            console.log('something is going wrong');
        });
}

function movieSelected(id){
  sessionStorage.setItem('movieId', id);
  window.location = 'movie.html';
  return false;
}

function getMovie(){
  let movieId = sessionStorage.getItem('movieId');

  axios.get('https://api.themoviedb.org/3/movie/'+movieId+'?api_key=fa155f635119344d33fcb84fb807649b')
    .then(function (response) {
      console.log(response);
      var movie = response.data;
      console.log(movie);

      let output =`
        <div class="row">
          <div class="col-md-4">
            <img onerror="handleMissingImg(this);" src="http://image.tmdb.org/t/p/w185/`+movie.poster_path+`" class="thumbnail">
          </div>
          <div class="col-md-8">
            <h2>${movie.title}</h2>
            <ul class="list-group">
              <li class="list-group-item"><strong>Budget:</strong> ${movie.budget} INR</li>
              <li class="list-group-item"><strong>Status:</strong> ${movie.status}</li>
              <li class="list-group-item"><strong>Released:</strong> ${movie.release_date}</li>
              <li class="list-group-item"><strong>Rating:</strong> ${movie.vote_count}</li>
              <li class="list-group-item"><strong>Vote Average:</strong> ${movie.vote_average}</li>
              <li class="list-group-item"><strong>Runtime:</strong> ${movie.runtime}  minutes</li>
              <li class="list-group-item"><strong>Revenue:</strong> ${movie.revenue} INR</li>
            </ul>
          </div>
        </div>
        <div class="row">
          <div class="well">
            <h3>Overview</h3>
            ${movie.overview}
            <hr>
            <a href="http://imdb.com/title/${movie.imdb_id}" target="_blank" class="btn btn-primary">View IMDB</a>
            <a href="index.html" class="btn btn-default">Go Back To Search</a>
          </div>
        </div>
      `;

      $('#movie').html(output);
    })
    .catch(function (error) {
      console.log(err);
    });
}

function handleMissingImg(ele)
    {
        ele.src = 'img/poster-not-found.jpeg';
    }