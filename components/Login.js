// import Expo from 'expo';
import React from 'react';
import { StyleSheet } from 'react-native';
import { Container, Content, Form, Item, Input, Label, Button, Text } from 'native-base';

export default class Login extends React.Component {
  state = {

  };

  render() {
    return (
      <Container>
        <Content>
          <Form>
            <Item stackedLabel>
              <Label>Email</Label>
              <Input
                value={this.props.username}
                onChangeText={(username) => this.props.usernameChange(username)}
              />
            </Item>
            <Item stackedLabel last>
              <Label>Password</Label>
              <Input
                value={this.props.password}
                onChangeText={(password) => this.props.passwordChange(password)}
                secureTextEntry={true}
              />
            </Item>
            <Button danger onPress={() => this.props.login()}>
              <Text>Login</Text>
            </Button>
          </Form>
        </Content>
      </Container>
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
