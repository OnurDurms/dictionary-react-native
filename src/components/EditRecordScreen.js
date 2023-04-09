import React, { useState, useEffect } from 'react';
import { SafeAreaView, Text, View, StyleSheet, Alert, TouchableOpacity, TextInput, FlatList, Button } from 'react-native';
import { openDatabase } from 'react-native-sqlite-storage';

var db = openDatabase({ name: 'DictionaryWordDatabase.db' });

const EditRecordScreen = ({ route, navigation }) => {

  const [word, setWord] = useState('');
  const [description, setDescription] = useState('');
  const [pronunciation, setPronunciation] = useState('');

  useEffect(() => {
    setWord(route.params.dictionary_word);
    setDescription(route.params.dictionary_description);
    setPronunciation(route.params.dictionary_pronunciation);
  }, []);

  const editData = () => {

    db.transaction((tx) => {
      tx.executeSql(
        'UPDATE dictionary_words set dictionary_word=?, dictionary_description=? , dictionary_pronunciation=? where dictionary_word=?',
        [word, description, pronunciation, word],
        (tx, results) => {
          console.log('Results', results.rowsAffected);
          if (results.rowsAffected > 0) {
            Alert.alert('Record Updated Successfully...')
          } else Alert.alert('Error');
        }
      );
    });
  }

  const deleteRecord = () => {
    db.transaction((tx) => {
      tx.executeSql(
        'DELETE FROM dictionary_words where dictionary_word=?',
        [word],
        (tx, results) => {
          console.log('Results', results.rowsAffected);
          if (results.rowsAffected > 0) {
            Alert.alert(
              'Done',
              'Record Deleted Successfully',
              [
                {
                  text: 'Ok',
                  onPress: () => navigation.navigate('ViewAllWordsScreen'),
                },
              ],
              { cancelable: false }
            );
          }
        }
      );
    });

  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.mainContainer}>

        <Text style={{ fontSize: 24, textAlign: 'center', color: '#000' }}>
          Edit Record
        </Text>

        <TextInput
          style={styles.textInputStyle}
          onChangeText={
            (text) => setWord(text)
          }
          placeholder="Enter Word"
          value={word} />

        <TextInput
          style={styles.textInputStyle}
          onChangeText={
            (text) => setDescription(text)
          }
          placeholder="Enter Description"
          value={description} />

        <TextInput
          style={styles.textInputStyle}
          onChangeText={
            (text) => setPronunciation(text)
          }
          placeholder="Enter Pronunciation"
          value={pronunciation} />

        <View style={styles.buttons}>
          <View style={styles.button}>
            <Button
              onPress={editData}
              title="Edit Data"
              color="#841584"
            />
          </View>
          <View style={styles.button}>
            <Button
              onPress={deleteRecord}
              title="Delete Data"
              color="#841584"
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default EditRecordScreen;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    alignItems: 'center',
    padding: 10,
  },

  buttons: {
    flexDirection: "row",
  },

  button: {
    margin: 20
  },

  textInputStyle: {
    height: 45,
    width: '90%',
    textAlign: 'center',
    borderWidth: 1,
    borderColor: '#00B8D4',
    borderRadius: 7,
    marginTop: 15,
  },

  itemsStyle: {
    fontSize: 22,
    color: '#000'
  }
});