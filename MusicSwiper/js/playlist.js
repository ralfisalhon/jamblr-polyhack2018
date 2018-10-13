    createAndPopulatePlaylist = async (tracks, user_id, access_token) => {
        var xhr = new XMLHttpRequest();

        xhr.onreadystatechange = (e) => {
            if (xhr.readyState !== 4) {
                return;
            }
            if (xhr.status == 200) {
                var data = xhr.responseText;
                var obj = JSON.parse(data.replace(/\r?\n|\r/g, ''));

                this.populatePlaylist(tracks, obj.id, user_id, access_token);
            }
        }

        xhr.open("POST", "https://api.spotify.com/v1/users/" + user_id + 
                         "/playlists");
        xhr.setRequestHeader("Authorization", "Bearer " + access_token);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send('{"name": "' + name + '", "description": "' + desc + '}');
    }

    populatePlaylist = async (tracks, playlist_id, user_id, access_token) => {
        var xhr = new XMLHttpRequest();

        xhr.onreadystatechange = (e) => {
            if (xhr.readyState !== 4) {
                return;
            }
            if (xhr.status == 200) {
                var data = xhr.responseText;
                var obj = JSON.parse(data.replace(/\r?\n|\r/g, ''));

                if (this.state.rights.length <= 100) {
                    Alert.alert("Playlist created with " + 
                                this.state.rights.length + " songs!");
                } else {
                    Alert.alert("Playlist created with 100 songs!");
                }
            }
        }

        /* Grab the first 100 elements. */
        var data   = this.state.rights.slice(0, 100);
        var tracks = [];
        for (var i = 0; i < data.length; i++) {
            tracks.push(data[i].uri);
        }

        xhr.open("POST", "https://api.spotify.com/v1/playlists/" + playlist_id +
                         "/tracks");
        xhr.setRequestHeader("Authorization", "Bearer " + access_token);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send(JSON.stringify(tracks));
    }