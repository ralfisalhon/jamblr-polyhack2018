import React, { Component } from "react";
import { Image, View, StyleSheet, StatusBar } from "react-native";
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

import TrackPlayer from 'react-native-track-player';

// Creates the player
TrackPlayer.setupPlayer().then(async () => {

    // Adds a track to the queue
    await TrackPlayer.add({
        id: 'trackId',
        // url: 'https://puu.sh/BK6L9/29289ffa0a.mp3',
        title: 'Track Title',
        artist: 'Track Artist',
        genre: 'Progressive House, Electro House',
    });

    // Starts playing it
    TrackPlayer.play();

});

var images = [
    require('./assets/swiper-1.png'),
    require('./assets/swiper-2.png'),
    require('./assets/swiper-3.png'),
    require('./assets/swiper-4.png')
];

const cards = [
    {
        text: "Card One",
        name: "Song Name One",
        image: images[0]
    },
    {
        text: "Card Two",
        name: "Song Name Two",
        image: images[1]
    },
    {
        text: "Card Three",
        name: "Song Name Three",
        image: images[2]
    },
    {
        text: "Card Four",
        name: "Song Name Four",
        image: images[3]
    }
];

class SimpleDeck extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tab1: true,
            tab2: false,
        };
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

    render() {
        return (
            <View style = {styles.container}>
                <View style = {styles.header}>
                <StatusBar barStyle= "light-content" />
                    <View style = {{height: 16}}></View>
                        <Text style = {styles.name}>
                            Music Swiper
                        </Text>
                </View>
                <View style = {styles.deckSwiper}>
                    <DeckSwiper
                    dataSource={cards}
                    looping={false}
                    renderEmpty={() =>
                        <View style = {styles.end}>
                            <Text>End of cards</Text>
                        </View>}
                    renderItem={item =>
                        <Card style={{ elevation: 3 }}>
                        <CardItem>
                            <Thumbnail source={item.image} />
                            <View style = {{padding: 10}}>
                                <Text>{item.name}</Text>
                            </View>
                        </CardItem>
                        <CardItem cardBody>
                            <Image style = {styles.image}
                            source={item.image}
                            />
                        </CardItem>
                        <CardItem style = {{justifyContent: 'center'}}>
                            <Text> {item.text} </Text>
                        </CardItem>
                        </Card>}/>
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
        }

export default SimpleDeck;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#3498db',
        justifyContent: 'space-between',
    },
    end: {
        marginTop: 50,
        alignItems: 'center',
    },
    header: {
        height: 60,
        backgroundColor: '#2980b9',
        borderBottomWidth: 0,
        justifyContent: 'center',
    },
    name: {
        textAlign: 'center',
        fontSize: 24,
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
        height: 300
    }
});
