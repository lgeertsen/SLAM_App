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
import Titlebar from './containers/Titlebar';
import TournamentList from './containers/TournamentList';

const io = require('socket.io-client');

var socket;

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      id: "1",
      name: "Lee Geertsen",
      username: "",
      password: "",
      tournaments: [{id: 1, name: 'Awesome tennis tournament'}, {id: 2, name: 'Epic tennis tournament'}], //[]
      tournament: undefined,
      match: undefined,
      fontLoaded: false,
      isConnected: false,
      authenticated: false, //false
      connecting: false,   //false
      isConnected: false,
    };
  }

  reset() {
    this.setState({
      tournament: undefined
    });
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

      socket.emit('refereeConnected', {id: this.state.id, name: this.state.name});
    });

    // socket.on('ping', data => {
    //   this.setState(data);
    // });

    socket.on('tournamentList', data => {
      // this.setState({tournaments: data.tournaments});
      console.log(this.state.tournaments);
    });

    socket.on('match', data => {
      this.setState({match: data.match});
      console.log(this.state.match);
    })
  }

  login(username, password) {
    console.log(this.state.username);
    console.log(this.state.password);
    this.setState({connecting: true});
    axios.post('https://lets-go2.herokuapp.com/oauth/token', querystring.stringify({
      // 'form_params': {
      'grant_type': 'password',
      'client_id': 2,
      'client_secret': '4AJyEGZaDSiNzQnWmKM5389Xkn9eVBKQ0PF5FWDk',
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

  addPoint(j) {
    console.log("tournament.id: " + this.state.tournament.id);
    socket.emit('addPoint', {
      tournament: this.state.tournament.id,
      tour: this.state.match.tour,
      id: this.state.match.id,
      joueur: j
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
            <View style={{height: '100%', backgroundColor: '#ecf0f1', justifyContent: 'center'}}>
              <Spinner color='red' />
            </View>
          ) : (
            <Login username={this.state.username}
            usernameChange={(username) => this.setState({'username': username})}
            password={this.state.password}
            passwordChange={(password) => this.setState({'password': password})}
            login={() => this.login()}/>
          )
        ) : (
          <Container>
            <Titlebar reset={() => this.reset()}/>
            <Content style={{paddingTop: 15, paddingHorizontal: 10}}>
              {this.state.tournament == undefined ?
                <View>
                  <Text style={{textAlign: 'center', marginBottom: 15}}>Welcome {this.state.name}</Text>
                  <Text style={{fontSize: 16, fontWeight: '800'}}>Tournaments:</Text>
                  <View>
                    { this.state.tournaments.length > 0 ?
                      <TournamentList
                        tournaments={this.state.tournaments}
                        joinTournament={(index) => this.joinTournament(index)}
                      />
                      :
                      <Text>There are no tournaments available right now</Text>
                    }
                  </View>
                </View>
                :
                <View>
                  <Text>{this.state.tournament.name}</Text>
                  {this.state.match == undefined ?
                    <Text>Waiting for tournament to start</Text>
                    :
                    <View>
                      <Text>{this.state.match._joueur1.lastName} VS {this.state.match._joueur2.lastName}</Text>
                      <Button danger onPress={() => this.addPoint(1)}>
                        <Text>Player1</Text>
                      </Button>
                      <Button danger onPress={() => this.addPoint(2)}>
                        <Text>Player2</Text>
                      </Button>
                    </View>
                  }
                </View>
              }
            </Content>
            <Footer>
              <FooterTab style={styles.footer}>
                {this.state.isConnected ?
                  <Text style={styles.white}>Connected</Text>
                :
                  <Spinner color='white' />
                }
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
  footer: {
    backgroundColor: '#D0021B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  white: {
    color: '#fff'
  }
});
