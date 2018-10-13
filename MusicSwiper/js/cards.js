    shuffleCards = async (genres, access_token) => {
        var xhr = new XMLHttpRequest();
        var query = "limit=25&;
        if (this.state.rights.length == 0) {
            query += "seed_genres=";

            for (var i = 0; i < genres.length; i++) {
                if (i != 0)
                    query += ", ";
                query += genres[i];
            }
        } else if (this.state.rights.length <= 5) {
            query += "seed_tracks=";

            for (var i = 0; i < this.state.rights.length; i++) {
                if (i != 0)
                    query += ", ";
                query += this.state.rights[i].id;
            }
        } else {
            query += "seed_tracks=";

            var arr = this.state.rights;
            for (var i = arr.length - 1; i > 0; i--) {
                var x = Math.floor(Math.random() * (i + 1));
                var y = a[i];
                a[i] = a[x];
                a[x] = y;
            }
            query += (arr[0].id + ", " + arr[1].id + ", " + arr[2].id + ", " +
                      arr[3].id + ", " + arr[4].id);
        }

        xhr.onreadystatechange = (e) => {
            if (xhr.readyState !== 4) {
                return;
            }
            if (xhr.status == 200) {
                data = xhr.responseText;

                var obj = JSON.parse(data.replace(/\r?\n|\r/g, ''));
                var final = [];

                for (var i = 0; i < obj.tracks.length; i++) {
                    var curr = obj.tracks[i];
                    var temp = {
                        artists:     curr.artists,
                        image:       curr.album.images[0].url,
                        id:          curr.id,
                        name:        curr.name,
                        preview_url: curr.preview_url,
                        seconds:     (curr.duration_ms / 1000),
                        uri:         curr.uri,
                    };
                    if (temp.preview_url != null) {
                        final.push(temp);
                    }
                }

                // console.log(final);
                this.setState({
                    cards: final,
                });
                this.swiped();
                console.log(this.state.cards);
            }
        }

        xhr.open("GET", "https://api.spotify.com/v1/recommendations?" + query);
        xhr.setRequestHeader("Authorization", "Bearer " + access_token);
        xhr.setRequestHeader("Accept", "application/json");
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send();
    }