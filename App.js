// noinspection ES6CheckImport

import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput, Button, ScrollView, Alert,
} from 'react-native';
import { HubConnectionBuilder } from '@microsoft/signalr';
import { SIGNALR_SERVER } from 'react-native-dotenv';

const App = () => {
  const [message, onChangeMessage] = useState('');
  const [disabled, setDisabled] = useState(true);
  const [receiveMessage, setReceiveMessage] = useState([]);
  const [username, onChangeUsername] = useState('');
  const [userGroupToSend, onChangeUserGroupToSend] = useState('');
  const [connection, setConnection] = useState(null);

  useEffect(() => {
    console.log('SignalR Server', SIGNALR_SERVER);
    const conn = new HubConnectionBuilder()
      .withUrl(SIGNALR_SERVER)
      .build();
    setConnection(conn);

    conn.on('ReceiveMessage', (group, user, msg) => {
      console.log('from+to+msg', user + ' > ' + group + ': ' + msg);
      setReceiveMessage(receiveMessage => [...receiveMessage, `to: ${group}, from: ${user}, msg: ${msg}`]);
    });

    conn.start()
      .then(() => {
        console.log('connected!');
        setDisabled(false);
      });
  }, []);

  const sendMessage = () => {
    if (username && message) {
      connection.invoke('SendMessage', userGroupToSend, username, message);
      Alert.alert('Message Sent', 'To Group/User: ' + userGroupToSend + '\nFrom User: ' + username + '\nMessage: ' + message);
    } else {
      Alert.alert('Fill username and message.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.welcome}>
        Welcome to Chat SignalR!
      </Text>
      <Text style={styles.instructions}>
        To get started, edit App.js
      </Text>
      <Text style={styles.instructions}>
        Press Cmd+R to reload,{'\n'}
        Cmd+D or shake for dev menu
      </Text>
      <TextInput
        style={styles.input}
        onChangeText={onChangeUsername}
        value={username}
        placeholder="Type your username"
      />
      <TextInput
        style={styles.input}
        onChangeText={onChangeUserGroupToSend}
        value={userGroupToSend}
        placeholder="Group/User to send"
      />
      <TextInput
        style={styles.input}
        onChangeText={onChangeMessage}
        value={message}
        placeholder="Type a message"
      />
      <Button
        title={disabled ? 'Not Connected' : 'Send message'}
        onPress={sendMessage}
        disabled={disabled}
      />
      <ScrollView style={styles.scrollView}>
        <Text>{receiveMessage.length ? receiveMessage.join('\n') : ''}</Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    width: '95%',
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  scrollView: {
    marginHorizontal: 20,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5fcff',
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

export default App;
