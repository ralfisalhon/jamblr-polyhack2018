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
} from "native-base";

var images = [
    require('./assets/swiper-1.png'),
    require('./assets/swiper-2.png'),
    require('./assets/swiper-3.png'),
    require('./assets/swiper-4.png')
];

const cards = [
    {
        text: "Card One",
        name: "One",
        image: images[0]
    },
    {
        text: "Card Two",
        name: "Two",
        image: images[1]
    },
    {
        text: "Card Three",
        name: "Three",
        image: images[2]
    },
    {
        text: "Card Four",
        name: "Four",
        image: images[3]
    }
];

class SimpleDeck extends Component {
    render() {
        return (
            <View style = {styles.container}>
                <View style = {styles.headerContainer}>
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
                    <View>
                        <Text>
                        {item.text}
                        </Text>
                        <Text note>NativeBase</Text>
                    </View>
                    </CardItem>
                    <CardItem cardBody>
                    <Image
                    style={{
                        resizeMode: "cover",
                        width: null,
                        flex: 1,
                        height: 300
                    }}
                    source={item.image}
                    />
                    </CardItem>
                    <CardItem>
                    <IconNB name={"ios-heart"} style={{ color: "#ED4A6A" }} />
                    <Text>
                    {item.name}
                    </Text>
                    </CardItem>
                    </Card>}/>
                    </View>
                </View>
                );
            }
        }

export default SimpleDeck;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#2980b9',
    },
    end: {
        marginTop: 50,
        alignItems: 'center',
    },
    headerContainer: {
        height: 65,
        backgroundColor: '#3498db',
        borderBottomWidth: 0,
        justifyContent: 'center',
    },
    name: {
        textAlign: 'center',
        fontSize: 24,
        color: 'white',
    },
    deckSwiper: {
        margin: 10,
    }
});
