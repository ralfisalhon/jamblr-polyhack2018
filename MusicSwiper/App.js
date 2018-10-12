import React, { Component } from "react";
import { Image, View, StyleSheet } from "react-native";
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
    Left,
    Right,
    Body
} from "native-base";

var images = [
    require('./assets/swiper-1.png'),
    require('./assets/swiper-2.png'),
    require('./assets/swiper-3.png'),
    require('./assets/swiper-4.png')
];

// const cardOne   = require('/assets/swiper-1.png');
// const cardTwo   = require('/assets/swiper-2.png');
// const cardThree = require('/assets/swiper-3.png');
// const cardFour  = require('/assets/swiper-4.png');

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
            <View>
                <DeckSwiper
                dataSource={cards}
                looping={false}
                renderEmpty={() =>
                    <View>
                        <Text>Over</Text>
                    </View>}
                renderItem={item =>
                    <Card style={{ elevation: 3 }}>
                    <CardItem>
                    <Left>
                    <Thumbnail source={item.image} />
                    <Body>
                    <Text>
                    {item.text}
                    </Text>
                    <Text note>NativeBase</Text>
                    </Body>
                    </Left>
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
                );
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
            welcome: {
                fontSize: 20,
                textAlign: 'center',
                margin: 10,
            },
            instructions: {
                textAlign: 'center',
                color: '#333333',
                marginBottom: 5,
            },
        });
