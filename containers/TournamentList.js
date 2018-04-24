// import Expo from 'expo';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import {
  Body,
  Button,
  Card,
  CardItem,
  Text
} from 'native-base';

export default class TournamentList extends React.Component {
  state = {

  };

  render() {
    return (
      <View>
        { this.props.tournaments.map((tournament, index) => (
          <Card key={tournament.id}>
            <CardItem>
              <Body style={{paddingBottom: 50}}>
                <Text>
                  {tournament.name}
                </Text>
                <Button bordered danger style={{position: 'absolute', right: 0, bottom: 0}} onPress={() => this.props.joinTournament(index)}>
                  <Text>Join tournament</Text>
                </Button>
              </Body>
            </CardItem>
          </Card>
        ))}
      </View>
    );
  }
}

const styles = StyleSheet.create({

});
