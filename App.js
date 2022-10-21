import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useAsyncStorage } from '@react-native-async-storage/async-storage';

export default function App() {
  const [username, setUsername] = useState(null);
  const { getItem, setItem } = useAsyncStorage('username');

  const readUsernameFromStorage = async () => {
    const username = await getItem();
    if (!username) {
      setUsername('Unknown User');
    } else {
      setUsername(username);
    }
  };

  useEffect(() => {readUsernameFromStorage()}, []);

  return (
    <View style={styles.container}>
      <Text>{`Welcome to the GigPig ${username}`}</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
