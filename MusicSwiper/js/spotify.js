var data;

/*
 * filterCardData(data)
 *
 * Takes JSON tracks data from Spotify and returns it as "cards" with important
 * information.
 */
function filterCardData(data) {
	var final = [];

	for (var i = 0; i < data.length; i++) {
		var curr = data[i];
		var temp = {
			artists:     curr.artists,
			id:          curr.id,
			name:        curr.name,
			preview_url: curr.preview_url,
			seconds:     (curr.duration_ms / 1000)
		};
		final.append(temp);
	}

	return final;
}

/* 
 *	getSongsFromGenres(genres, access_token, callback)
 *
 *	Takes list of genres, from the following: 
 *  "acoustic", "afrobeat", "alt-rock", "alternative", "ambient", "anime",
 *  "black-metal", "bluegrass", "blues", "bossanova", "brazil", "breakbeat", 
 *  "british", "cantopop", "chicago-house", "children", "chill", "classical",
 *  "club", "comedy", "country", "dance", "dancehall", "death-metal", 
 *  "deep-house", "detroit-techno", "disco", "disney", "drum-and-bass", "dub",
 *  "dubstep", "edm", "electro", "electronic", "emo", "folk", "forro", "french",
 *  "funk", "garage", "german", "gospel", "goth", "grindcore", "groove",
 *  "grunge", "guitar", "happy", "hard-rock", "hardcore", "hardstyle", 
 *  "heavy-metal", "hip-hop", "holidays", "honky-tonk", "house", "idm",
 *  "indian", "indie", "indie-pop", "industrial", "iranian", "j-dance",
 *  "j-idol", "j-pop", "j-rock", "jazz", "k-pop", "kids", "latin", "latino",
 *  "malay", "mandopop", "metal", "metal-misc", "metalcore", "minimal-techno",
 *  "movies", "mpb", "new-age", "new-release", "opera", "pagode", "party",
 *  "philippines-opm", "piano", "pop", "pop-film", "post-dubstep", "power-pop",
 *  "progressive-house", "psych-rock", "punk", "punk-rock", "r-n-b",
 *  "rainy-day", "reggae", "reggaeton", "road-trip", "rock", "rock-n-roll",
 *  "rockabilly", "romance", "sad", "salsa", "samba", "sertanejo", "show-tunes",
 *  "singer-songwriter", "ska", "sleep", "songwriter", "soul", "soundtracks",
 *  "spanish", "study", "summer", "swedish", "synth-pop", "tango", "techno",
 *  "trance", "trip-hop", "turkish", "work-out", "world-music",
 *  as well as an access_token.
*/
function getSongsFromGenres(genres, access_token) {
    var xhr = new XMLHttpRequest();
    var query = "limit=10" +
                "seed_genres=[";
    for (var i = 0; i < genres.length; i++) {
    	query += genres[i];
    }
    query += "]";
    xhr.open("GET", "https://api.spotify.com/v1/recommendations?" + query);
    xhr.setRequestHeader("Authorization", token);

    xhr.onreadystatechange = function() {
    	if (xhr.readyState == 4 && xhr.status == 200) {
    		data = filterCardData(JSON.parse(xhr.responseText));
    	}
    }
    xhr.send(query);
}
