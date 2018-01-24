import Expo from 'expo';
import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import { Container, Header, Title, Content, Footer, FooterTab, Button, Left, Right, Body, Icon } from 'native-base';

const io = require('socket.io-client');

export default class App extends React.Component {
  state = {
    fontLoaded: false,
    isConnected: false,
    data: null,
  };

  async componentWillMount() {
    await Expo.Font.loadAsync({
      'Roboto': require('native-base/Fonts/Roboto.ttf'),
      'Roboto_medium': require('native-base/Fonts/Roboto_medium.ttf'),
    });

    this.setState({ fontLoaded: true });
  }

  componentDidMount() {
    // INSTRUCTION:
    // or replace with your local ngrok url, eg: https://brent123.ngrok.io
    // start ngrok with ngrok http 3000 --subdomain=brent123
    // where the subdomain is whatever subdomain you want
    const socket = io('https://slamserver-rkprnuoghc.now.sh/', {
      transports: ['websocket'],
    });

    socket.on('connect', () => {
      this.setState({ isConnected: true });
    });

    socket.on('ping', data => {
      this.setState(data);
    });
  }

  render() {
    let pic = {
      uri: 'https://i.imgur.com/yUEddOv.png'
    };

    return (
      this.state.fontLoaded ? (
        <Container>
          <Header>
            <Left>
              <Button transparent>
                <Icon name='menu' />
              </Button>
            </Left>
            <Body>
              <Title>SLAM</Title>
            </Body>
            <Right />
          </Header>
          <Content>
            <Image source={pic} style={{width: 70, height: 70}}/>
            <Text>connected: {this.state.isConnected ? 'true' : 'false'}</Text>
            {this.state.data &&
              <Text>
                ping response: {this.state.data}
              </Text>}
          </Content>
          <Footer>
            <FooterTab>
              <Button full>
                <Text>Footer</Text>
              </Button>
            </FooterTab>
          </Footer>
        </Container>
      ) : null
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
