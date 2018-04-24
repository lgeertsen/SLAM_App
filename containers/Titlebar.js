// import Expo from 'expo';
import React from 'react';
import { StyleSheet } from 'react-native';
import {
  Body,
  Button,
  Header,
  Icon,
  Left,
  Right,
  Title,
} from 'native-base';

export default class Titlebar extends React.Component {
  state = {

  };

  render() {
    return (
      <Header style={styles.header}>
        <Left>
          {/* <Button transparent>
            <Icon name='menu' />
          </Button> */}
        </Left>
        <Body>
          <Title>LETS GO</Title>
        </Body>
        <Right>
          <Button transparent onPress={() => this.props.reset()}>
            <Icon name='refresh' />
          </Button>
        </Right>
      </Header>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#D0021B'
  },
});
