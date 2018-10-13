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
            // Alert.alert("display_name", result.display_name)
		}).catch((error) => {
			Alert.alert("Error", error.message);
		});

        console.log("accessToken", Spotify.getAuth().accessToken);

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
				"scopes":["user-read-private", "playlist-read", "playlist-read-private", "streaming", "user-library-modify", "user-library-read"],
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
        // Alert.alert(this.rights.length.toString());

        if(direction == "right") {
            this.rights.push(this.state.cards[globalCurrently]);
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
                                        <View style = {{height: 20}}></View>
                                            <Text style = {styles.name}>
                                                Jamblr
                                            </Text>
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
                                            <Card style={{ elevation: 3 }}>
                                            <CardItem>
                                                <Thumbnail source={{uri: item.image}} />
                                                <View style = {{marginLeft: 10, marginRight: 50}}>
                                                    <Text>{item.name}</Text>
                                                    <Text note>{item.artists[0].name} </Text>
                                                </View>
                                            </CardItem>
                                            <CardItem cardBody>
                                                <Image style = {styles.image}
                                                source={{uri: item.image}}
                                                />
                                            </CardItem>
                                            </Card>}/>
                                            </View>
                                        <View style = {{justifyContent: 'center', alignItems: 'center', marginBottom: 20}}>
                                        <TouchableOpacity
                                        style = {{height: 50, width: 100, backgroundColor: '#2980b9', justifyContent: 'center', alignItems: 'center', borderRadius: 50, borderWidth: 0.5, borderColor: 'black'}}
                                        onPress={() => this.refreshPressed()}>
                                            <Icon name="refresh" color="white" fontSize="50" />
                                        </TouchableOpacity>
                                        </View>

                                        <Footer>
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
                                        </Footer>
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
		backgroundColor: '#F5FCFF',
	},
    container2: {
        flex: 1,
        backgroundColor: '#3498db',
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
        height: 65,
        backgroundColor: '#2980b9',
        borderBottomWidth: 0,
        justifyContent: 'center',
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
        height: 375
    }
});
