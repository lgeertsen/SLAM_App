// import Expo from 'expo';
import React from 'react';
import { Keyboard, StyleSheet, View } from 'react-native';
import {
  Button,
  Container,
  Content,
  Form,
  Icon,
  Item,
  Input,
  Label,
  Text,
  Thumbnail
} from 'native-base';

export default class Login extends React.Component {
  state = {
    focused: false
  };

  componentDidMount () {
    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => this.setState({focused: true}));
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => this.setState({focused: false}));
  }

  componentWillUnmount () {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }

  render() {
    const uri = "https://images.unsplash.com/photo-1519672808815-bdd52bb3bd41?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=cdd94e68a0b91f05fbc68d4369ff1e2f&auto=format&fit=crop&w=753&q=80";
    return (
      <Container>
        <View style={styles.container}>
          {this.state.focused ?
            <View style={{height: 40}}></View> :
            <Thumbnail square
              style={{width: '100%', height: '40%'}}
              source={{uri: uri}}
            />
          }
          <Form style={styles.form}>
            <Item rounded style={styles.input}>
              <Icon active name='person' />
              <Input
                placeholder={"Email"}
                value={this.props.username}
                onChangeText={(username) => this.props.usernameChange(username)}
              />
            </Item>
            <Item rounded last style={styles.input}>
              <Icon active name='lock' />
              <Input
                placeholder={"Password"}
                value={this.props.password}
                onChangeText={(password) => this.props.passwordChange(password)}
                secureTextEntry={true}
              />
            </Item>
            <Button danger full onPress={() => this.props.login()}>
              <Text>Login</Text>
            </Button>
          </Form>
        </View>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ecf0f1',
  },
  form: {
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  input: {
    marginTop: 8,
    marginBottom: 20,
    paddingLeft: 5,
  }
});
