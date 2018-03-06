import Expo from 'expo';
import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import { Container, Header, Title, Content, Footer, FooterTab, Button, Left, Right, Body, Icon, Spinner } from 'native-base';

import axios from 'axios';
import querystring from 'querystring';

import Login from './components/Login';

const io = require('socket.io-client');

var socket;

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      id: "",
      name: "",
      username: "",
      password: "",
      tournaments: [],
      fontLoaded: false,
      isConnected: false,
      authenticated: false,
      connecting: false,
      isConnected: false,
    };
  }

  async componentWillMount() {
    await Expo.Font.loadAsync({
      'Roboto': require('native-base/Fonts/Roboto.ttf'),
      'Roboto_medium': require('native-base/Fonts/Roboto_medium.ttf'),
    });

    this.setState({ fontLoaded: true });
  }

  componentDidMount() {
    socket = io('https://lets-go-server.herokuapp.com', {
      transports: ['websocket'],
    });

    socket.on('connected', () => {
      console.log("connected to server");
      this.setState({ isConnected: true });
    });

    // socket.on('ping', data => {
    //   this.setState(data);
    // });
  }

  login(username, password) {
    console.log(this.state.username);
    console.log(this.state.password);
    this.setState({connecting: true});
    axios.post('https://lets-go2.herokuapp.com/oauth/token', querystring.stringify({
      // 'form_params': {
        'grant_type': 'password',
        'client_id': 1,
        'client_secret': 'wrHi5IRItm3ib5xcdHGCO5ClENgFymSE0aaECyHl',
        'username': this.state.username,
        'password': this.state.password,
        'scope': '*',
      // }
    }))
    .then(response => {
      console.log(response);
      this.getUserInfo();
      this.setState({'accessToken': response.data.access_token})
    })
    .catch(error => {
      console.log(error);
    });
  }

  getUserInfo() {
    let url = 'https://lets-go2.herokuapp.com/api/user?email=' + this.state.username;
    axios.get(url, {
      headers: {
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + this.state.accessToken
      }
    })
    .then((response) => {
      console.log(response);
      socket.emit('refereeConnected', {id: response.data.id, name: response.data.name});
      this.setState({authenticated: true, id: response.data.id, name: response.data.name});
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  render() {
    let pic = {
      uri: 'https://i.imgur.com/yUEddOv.png'
    };

    return (
      this.state.fontLoaded ? (
        !this.state.authenticated ? (
          this.state.connecting ? (
            <Spinner color='red' />
          ) : (
            <Login username={this.state.username}
              usernameChange={(username) => this.setState({'username': username})}
              password={this.state.password}
              passwordChange={(password) => this.setState({'password': password})}
              login={() => this.login()}/>
          )
        ) : (
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
              <Text>Welcome {this.state.name}</Text>
              <Text>connected: {this.state.isConnected ? 'true' : 'false'}</Text>
              <Text>
                {this.state.tournaments.length > 0 ?

                  :
                  "There are no tournaments available right now"
                }
              </Text>
            </Content>
            <Footer>
              <FooterTab>
                <Button full>
                  <Text>Footer</Text>
                </Button>
              </FooterTab>
            </Footer>
          </Container>
        )
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
