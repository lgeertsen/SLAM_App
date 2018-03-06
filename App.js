import Expo from 'expo';
import React from 'react';
import { StyleSheet, View, Image } from 'react-native';
import {
  Body,
  Button,
  Card,
  CardItem,
  Container,
  Content,
  Footer,
  FooterTab,
  Header,
  Icon,
  Left,
  Right,
  Spinner,
  Text,
  Title
} from 'native-base';

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
<<<<<<< HEAD
=======

      tournament: undefined,

>>>>>>> 847a96ceefcf389a367d2851eb263bd8c45d8deb
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

    socket.on('tournamentList', data => {
      this.setState({tournaments: data.tournaments});
      console.log(this.state.tournaments);
    });
  }

  login(username, password) {
    console.log(this.state.username);
    console.log(this.state.password);
    this.setState({connecting: true});
    axios.post('https://lets-go2.herokuapp.com/oauth/token', querystring.stringify({
      // 'form_params': {
      'grant_type': 'password',
      'client_id': 2,
      'client_secret': 'NcA0wfGbZkyYiqqdcK0eYXwpOLjgAx9snLrI9RCD',
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

  joinTournament(index) {
    let tournament = this.state.tournaments[index];
    this.setState({tournament: tournament});
    socket.emit('joinTournament', {id: tournament.id});
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
              <Text>Connected: {this.state.isConnected ? 'true' : 'false'}</Text>
              {this.state.tournament == undefined ?
                <View>
                  <Text>Tournaments:</Text>
                  <View>
                    { this.state.tournaments.length > 0 ?
                      <View>
                        { this.state.tournaments.map((tournament, index) => (
                          <Card key={tournament.id}>
                            <CardItem>
                              <Body>
                                <Text>
                                  {tournament.name}
                                </Text>
                                <Button bordered success onPress={() => this.joinTournament(index)}>
                                  <Text>Join tournament</Text>
                                </Button>
                              </Body>
                            </CardItem>
                          </Card>
                        ))}
                      </View>
                      :
                      <Text>There are no tournaments available right now</Text>
                    }
                  </View>
                </View>
                :
                <View>
                  <Text>{this.state.tournament.name}</Text>
                </View>
              }
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
