import React, { Component } from "react";
import { Image, View, StyleSheet, StatusBar, Alert, ActivityIndicator, TouchableHighlight, TouchableOpacity } from "react-native";
import {
    Container,
    Header,
    Title,
    Button,
    IconNB,
    DeckSwiper,
    Card,
    CardItem,
    Icon,
    Thumbnail,
    Text,
    Footer,
    FooterTab,
    Content,
} from "native-base";

global.globalData = "";
global.globalUserID = "";

console.disableYellowBox = true;

import TrackPlayer from 'react-native-track-player';
import Spotify from 'rn-spotify-sdk';

// Creates the player
TrackPlayer.setupPlayer().then(async () => {

    // Adds a track to the queue
    /*
    await TrackPlayer.add({
        id: 'trackId',
        url: 'https://puu.sh/BK6L9/29289ffa0a.mp3',
        title: 'Track Title',
        artist: 'Track Artist',
        genre: 'Progressive House, Electro House',
    });
    */

    // Starts playing it
    TrackPlayer.play();

});

class SimpleDeck extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tab1: true,
            tab2: false,
            spotifyLoggedIn: false,
            cards: [],

        };

        this.rights = [];
        this.rightsTotal = [];

        global.globalCurrently = 0;

        var self = this;
        this.getSongsFromGenres = this.getSongsFromGenres.bind(this);

        this.state = {spotifyInitialized: false};
        // this.spotifyLoginButtonWasPressed();
    }
    toggleTab1() {
        this.setState({
            tab1: true,
            tab2: false,
        });
    }
    toggleTab2() {
        this.setState({
            tab1: false,
            tab2: true,
        });
    }

    filterCardData(data) {

    }
    getSongsFromGenres = async (genres, access_token) => {
        var xhr = new XMLHttpRequest();
        var query = "limit=20&seed_genres=";

        for (var i = 0; i < genres.length; i++) {
            if (i != 0)
                query += ", "
            query += genres[i];
        }

        xhr.onreadystatechange = (e) => {
            if (xhr.readyState !== 4) {
                return;
            }
        	if (xhr.readyState == 4 && xhr.status == 200) {
                var data = xhr.responseText;

                var obj = JSON.parse(data.replace(/\r?\n|\r/g, ''));
                // console.log("OBJ IS HERE", obj);

                var final = [];

                global.globalArtistIm = "";

            	for (var i = 0; i < obj.tracks.length; i++) {
            		var curr = obj.tracks[i];

                    // Spotify.getArtist(curr.artists[0].id).then((result) => {
                    //     globalArtistIm = result.images[1].url;
                    //     console.log("Printing for", i, globalArtistIm);
            		// }).catch((error) => {
            		// 	Alert.alert("Error", error.message);
            		// });

                    console.log("HERE", curr.album.images);
                    if (curr.album.images != undefined){
                		var temp = {
                			artists:     curr.artists,
                            image:       curr.album.images[0].url,
                			id:          curr.id,
                			name:        curr.name,
                			preview_url: curr.preview_url,
                			seconds:     (curr.duration_ms / 1000),
                            uri:         curr.uri,
                            artistIm:    globalArtistIm,
                		};
                        if (temp.preview_url != null) {
                    		final.push(temp);
                        }
                    }
            	}

                final.push(temp);
                final.push(temp);
                // console.log(final);
                this.setState({
                    cards: final,
                });
                this.swiped("left");
                // console.log(this.state.cards);
        	}
        }

        xhr.open("GET", "https://api.spotify.com/v1/recommendations?" + query);
        xhr.setRequestHeader("Authorization", "Bearer " + access_token);
        xhr.setRequestHeader("Accept", "application/json");
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send();
    }

    logIn()
	{
		// Alert.alert("Logged in");
        this.setState({
            spotifyLoggedIn: true,
        });

        Spotify.getMe().then((result) => {
            // Alert.alert("id", result.id);
            globalUserID = result.id;
            console.log("accessToken", Spotify.getAuth().accessToken);
            console.log("user_id", globalUserID);
		}).catch((error) => {
			Alert.alert("Error", error.message);
		});

        this.getSongsFromGenres(["pop", "alternative", "rap", "metal", "jazz"], Spotify.getAuth().accessToken)
	}

    shuffleCards = async (genres, access_token) => {
        // Alert.alert("In shuffleCards");
        var xhr = new XMLHttpRequest();
        var query = "limit=20&";
        if (this.rights.length == 0) {
            // Alert.alert("Length 0");
            query += "seed_genres=";

            for (var i = 0; i < genres.length; i++) {
                if (i != 0)
                    query += ",";
                query += genres[i];
            }
        } else if (this.rights.length <= 5) {
            // Alert.alert("Length less than 5");
            query += "seed_tracks=";

            for (var i = 0; i < this.rights.length; i++) {
                if (i != 0)
                    query += ",";
                query += this.rights[i].id;
            }
        } else {
            // Alert.alert("Length else");
            query += "seed_tracks=";

            var arr = this.rights;
            for (var i = arr.length - 1; i > 0; i--) {
                var x = Math.floor(Math.random() * (i + 1));
                var y = arr[i];
                arr[i] = arr[x];
                arr[x] = y;
            }
            query += (arr[0].id + "," + arr[1].id + "," + arr[2].id + "," +
                      arr[3].id + "," + arr[4].id);
        }

        // Alert.alert(query);

        xhr.onreadystatechange = (e) => {
            if (xhr.readyState !== 4) {
                return;
            }
            if (xhr.status == 200) {
                // Alert.alert("Response received");
                var data = xhr.responseText;

                var obj = JSON.parse(data.replace(/\r?\n|\r/g, ''));
                var final = [];

                for (var i = 0; i < obj.tracks.length; i++) {
                    var curr = obj.tracks[i];

                    console.log("HERE", curr.album.images);
                    if (curr.album.images != undefined) {
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
                }

                // Alert.alert(final.length.toString());

                var temp = []
                // temp.push(this.state.cards[this.state.cards.length-1]);
                temp.push(final);

                this.setState({
                    cards: final,
                });

                this.rights = [];
                globalCurrently = 0;
                this.swiped("left");

                // this.swiped("left");
                // console.log(this.state.cards);
            }
        }
        console.log("QUERY:", query);
        console.log("TOKEN:", access_token);
        xhr.open("GET", "https://api.spotify.com/v1/recommendations?" + query);
        xhr.setRequestHeader("Authorization", "Bearer " + access_token);
        xhr.setRequestHeader("Accept", "application/json");
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send();
    }

    componentDidMount()
	{
		// initialize Spotify if it hasn't been initialized yet
		if(!Spotify.isInitialized())
		{
			// initialize spotify
			var spotifyOptions = {
				"clientID":"67d0b41ce73546b0a57762f74017f107",
				"sessionUserDefaultsKey":"SpotifySession",
				"redirectURL":"http://music-swipe.herokuapp.com/",
				"scopes":["user-read-private", "playlist-read", "playlist-read-private", "streaming", "user-library-modify", "user-library-read", "playlist-modify-public", "playlist-modify-private"],
			};
			Spotify.initialize(spotifyOptions).then((loggedIn) => {
				// update UI state
				this.setState({spotifyInitialized: true});
				// handle initialization
				if(loggedIn)
				{
					// Alert.alert("Logged in to Spotify");
                    this.logIn();
				}
			}).catch((error) => {
				Alert.alert("Error", error.message);
			});

            // this.spotifyLoginButtonWasPressed();
		}
		else
		{
			// update UI state
			this.setState((state) => {
				state.spotifyInitialized = true;
				return state;
			});
			// handle logged in
			if(Spotify.isLoggedIn())
			{
				// Alert.alert("Logged in to Spotify");
                this.logIn();
			}
		}
	}

    spotifyLoginButtonWasPressed()
	{
		// log into Spotify
		Spotify.login().then((loggedIn) => {
			if(loggedIn)
			{
				// logged in
                this.logIn();

			}
			else
			{
				// cancelled
			}
		}).catch((error) => {
			// error
			Alert.alert("Error", error.message);
		});
	}

    swiped(direction)
    {
        // if (direction == "right") {
        //     Alert.alert(this.state.cards[globalCurrently-1].name);
        // }

        if(direction == "right") {
            this.rights.push(this.state.cards[globalCurrently-1]);
            this.rightsTotal.push(this.state.cards[globalCurrently-1]);
        }

        // Spotify.playURI(this.state.cards[globalCurrently].uri, 0, 0);

        TrackPlayer.reset();

        // Adds a track to the queue
        TrackPlayer.add({
            id: 'trackId',
            url: this.state.cards[globalCurrently].preview_url,
            title: 'Track Title',
            artist: 'Track Artist',
            genre: 'Progressive House, Electro House',
        });

        TrackPlayer.play();

        globalCurrently += 1;

        // Alert.alert(this.state.cards.length.toString(), globalCurrently.toString());
        if (this.state.cards.length <= globalCurrently + 3) {
            //Alert.alert("Here");
            this.shuffleCards(["pop", "alternative", "rap", "metal", "jazz"], Spotify.getAuth().accessToken)
        }
    }

    refreshPressed()
    {
        TrackPlayer.reset();

        // Adds a track to the queue
        TrackPlayer.add({
            id: 'trackId',
            url: this.state.cards[globalCurrently - 1].preview_url,
            title: 'Track Title',
            artist: 'Track Artist',
            genre: 'Progressive House, Electro House',
        });

        TrackPlayer.play();
    }

    exportPressed()
    {
        this.createAndPopulatePlaylist(globalUserID, Spotify.getAuth().accessToken);
    }

    createAndPopulatePlaylist = async (user_id, access_token) => {
        console.log("createAndPopulatePlaylist called");
        var xhr = new XMLHttpRequest();

        var date = new Date();
        var name = date.toString();

        xhr.onreadystatechange = (e) => {
            // console.log("State changed", xhr.status.toString());
            if (xhr.readyState !== 4) {
                return;
            }
            if (xhr.readyState == 4 && xhr.status == 201) {
                console.log("MADE IT HERE");
                Alert.alert("Playlist created!");
                var data = xhr.responseText;
                var obj = JSON.parse(data.replace(/\r?\n|\r/g, ''));

                this.populatePlaylist(obj.id, user_id, access_token);
            }
        }

        xhr.open("POST", "https://api.spotify.com/v1/users/" + user_id +
                         "/playlists");
        xhr.setRequestHeader("Authorization", "Bearer " + access_token);
        xhr.setRequestHeader("Content-Type", "application/json");
        // xhr.send('{"name": "' + name + '", "description": "' + desc + '}');
        // Alert.alert(bodyData);
        xhr.send('{"name":"' + name + '","description": "Your Jamblr playlist!","public": false}');
    }

    populatePlaylist = async (playlist_id, user_id, access_token) => {
        var xhr = new XMLHttpRequest();

        xhr.onreadystatechange = (e) => {
            if (xhr.readyState !== 4) {
                return;
            }
            if (xhr.readyState == 4 && xhr.status == 201) {
                var data = xhr.responseText;
                var obj = JSON.parse(data.replace(/\r?\n|\r/g, ''));

                if (this.rightsTotal.length <= 100) {
                    Alert.alert("Playlist created with " +
                                this.rightsTotal.length + " songs!");
                } else {
                    Alert.alert("Playlist created with 100 songs!");
                }
            }
        }

        /* Grab the first 100 elements. */
        var data = this.rightsTotal.slice(0, 100);
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

    render()
	{
		if(!this.state.spotifyInitialized)
		{
			return (
				<View style={styles.container}>
					<ActivityIndicator animating={true}>
					</ActivityIndicator>
					<Text style={styles.loadMessage}>
						Loading...
					</Text>
				</View>
			);
		}
		else
		{
            {
                if (this.state.spotifyLoggedIn)
                {
                    {
                        if (this.state.cards && this.state.cards.length > 1)
                        {
                            return (
                                <View style = {styles.container2}>
                                    <View style = {styles.header}>
                                    <StatusBar barStyle= "light-content" />
                                        <View style = {{height: 25}}></View>
                                        <Image
                                        style = {styles.image2}
                                        source={{uri: "https://puu.sh/BKpe6/100d09c952.png"}}
                                        />
                                    </View>
                                    <View style = {styles.deckSwiper}>
                                        <DeckSwiper
                                        dataSource={this.state.cards}
                                        looping={false}
                                        onSwipeRight={item =>
                                            // Alert.alert('swiped right', item.text)
                                            this.swiped("right")
                                        }
                                        onSwipeLeft={item =>
                                            // Alert.alert('swiped left', item.text)
                                            this.swiped("left")
                                        }
                                        renderEmpty={() =>
                                            <View style = {styles.end}>
                                                <Text>End of cards</Text>
                                            </View>}
                                        renderItem={item =>
                                            <View style = {{backgroundColor: 'white', borderRadius: 25, margin: 5, marginTop: -125, borderWidth: 2, borderColor: 'white'}}>
                                            <View style = {{flexDirection: 'row', margin: 10}}>
                                                <Thumbnail source={{uri: item.image}} />
                                                <View style = {{marginLeft: 10, marginRight: 50, marginTop: 10}}>
                                                    <Text>{item.name}</Text>
                                                    <Text note>{item.artists[0].name} </Text>
                                                </View>
                                            </View>
                                            <View>
                                                <Image style = {styles.image}
                                                source={{uri: item.image}}
                                                />
                                            </View>
                                            </View>}/>
                                            </View>
                                        <View style = {{justifyContent: 'center', alignItems: 'center', marginBottom: 20, flexDirection: 'row'}}>
                                        <TouchableOpacity
                                        style = {{height: 50, width: 100, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center', borderRadius: 50, borderWidth: 0.5, borderColor: 'black', marginHorizontal: 10}}
                                        onPress={() => this.refreshPressed()}>
                                            <Icon name="refresh" color="white" fontSize="50" />
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                        style = {{height: 50, width: 100, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center', borderRadius: 50, borderWidth: 0.5, borderColor: 'black', marginHorizontal: 10}}
                                        onPress={() => this.exportPressed()}>
                                            <Icon name="send" color="white" fontSize="50" />
                                        </TouchableOpacity>
                                        </View>

                                        {/*<Footer>
                                            <FooterTab>
                                            <Button active={this.state.tab1} onPress={() => this.toggleTab1()}>
                                                <Icon active={this.state.tab1} name="ios-musical-notes" />
                                                <Text>Swiper</Text>
                                            </Button>
                                            <Button active={this.state.tab2} onPress={() => this.toggleTab2()}>
                                                <Icon active={this.state.tab2} name="ios-list-box" />
                                                <Text>Results</Text>
                                            </Button>
                                            </FooterTab>
                                        </Footer>*/}
                                    </View>
                			);
                        }
                        else
                        {
                            return (
                				<View style={styles.container}>
                					<Text style={styles.greeting}>
                						Waiting for data...
                					</Text>
                				</View>
                			);
                        }
                    }
                }
                else
                {
                    return (
        				<View style={styles.container}>
        					<Text style={styles.greeting}>
        						Hey! You! Log into your spotify
        					</Text>
        					<TouchableHighlight onPress={this.spotifyLoginButtonWasPressed} style={styles.spotifyLoginButton}>
        						<Text style={styles.spotifyLoginButtonText}>Log into Spotify</Text>
        					</TouchableHighlight>
        				</View>
        			);
                }

            }

		}
	}
}

export default SimpleDeck;

const styles = StyleSheet.create({
    container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#2b2929',
	},
    container2: {
        flex: 1,
        backgroundColor: '#3a3838',
        justifyContent: 'space-between',
    },
	loadMessage: {
		fontSize: 20,
		textAlign: 'center',
		margin: 10,
	},

	spotifyLoginButton: {
		justifyContent: 'center',
		borderRadius: 18,
		backgroundColor: 'green',
		overflow: 'hidden',
		width: 200,
		height: 40,
		margin: 20,
	},
	spotifyLoginButtonText: {
		fontSize: 20,
		textAlign: 'center',
		color: 'white',
	},

	greeting: {
		fontSize: 20,
		textAlign: 'center',
		margin: 10,
	},
    end: {
        marginTop: 50,
        alignItems: 'center',
    },
    header: {
        height: 200,
        backgroundColor: '#0086ff',
        borderBottomWidth: 0,
        alignItems: 'center',
        borderBottomLeftRadius: 15,
        borderBottomRightRadius: 15,
    },
    name: {
        textAlign: 'center',
        fontSize: 22,
        color: 'white',
    },
    deckSwiper: {
        flex: 1,
        margin: 10,
    },
    image: {
        resizeMode: "cover",
        width: null,
        flex: 1,
        height: 425,
        borderRadius: 25,
    },
    image2: {
        resizeMode: "cover",
        height: 45,
        width: 30,
    }
});
