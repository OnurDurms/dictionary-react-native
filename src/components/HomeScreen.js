import React, { useState, useEffect } from 'react';
import { SafeAreaView, Text, View, StyleSheet, ActivityIndicator, Alert, TouchableOpacity, TextInput, FlatList,Button } from 'react-native';
import { openDatabase } from 'react-native-sqlite-storage';
import {values} from '../data/data';

var db = openDatabase({ name: 'DictionaryWordDatabase.db' });
const HomeScreen = ({ navigation }) => {
  const [word, setWord] = useState('');
  const [description, setDescription] = useState('');
  const [pronunciation, setPronunciation] = useState('');
  const [loader, setLoader] = useState(true);
  var loaderCount = 0;

  useEffect(() => {
    db.transaction(function (txn) {
      txn.executeSql("CREATE TABLE IF NOT EXISTS dictionary_words (id INTEGER PRIMARY KEY AUTOINCREMENT, dictionary_word VARCHAR, dictionary_description VARCHAR, dictionary_pronunciation VARCHAR)");
      txn.executeSql(
        "SELECT COUNT(*) AS count FROM dictionary_words",
        [],
        function (tx, res) {
          console.log('item:', res.rows.item(0).count);
          if (res.rows.item(0).count == 0) {
            for(let i=0;i<values.length;i++){
                insertDefaultDatas(values[i].word,values[i].description,values[i].pronunciation);
            }
          }else{
              if(res.rows.item(0).count > 3600){
                    setLoader(false);
              }
          }
        }
      );
    })

  }, []);

  const insertData = () => {

    if (word == '' || description == '') {
      Alert.alert('Please Enter All the Values');
    } else {
      db.transaction(function (tx) {
      txn.executeSql("CREATE TABLE IF NOT EXISTS dictionary_words (id INTEGER PRIMARY KEY AUTOINCREMENT, dictionary_word VARCHAR, dictionary_description VARCHAR, dictionary_pronunciation VARCHAR)");
        tx.executeSql(
          'INSERT INTO dictionary_words (dictionary_word, dictionary_description, dictionary_pronunciation) VALUES (?,?,?)',
          [word, description, pronunciation],
          (tx, results) => {
            console.log('Results', results.rowsAffected);
            if (results.rowsAffected > 0) {
              Alert.alert('Data Inserted Successfully....');
            } else Alert.alert('Failed....');
          }
        );
      });

    }
  }

  const insertDefaultDatas = (field1,field2,field3) => {
      db.transaction(function (tx) {
        tx.executeSql(
          'INSERT INTO dictionary_words (dictionary_word, dictionary_description, dictionary_pronunciation) VALUES (?,?,?)',
          [field1,field2,field3], (tx, results) => {
               loaderCount++;
               if(loaderCount > 3640){
                 setLoader(false);
               }
          });
      });
  }

  const navigateToScreen = (screen,params) => {
    navigation.navigate(screen,params);
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.mainContainer}>
      {loader ?
      <View style={{flex : 1, justifyContent: 'center', alignItems: 'center'}}>
        <Text
          style={{
               color: "#111",
            }}>
            Default Words Loading ...
        </Text>
        <ActivityIndicator size="large" style={{ marginTop: 50, transform: [{ scaleX: 2 }, { scaleY: 2 }] }} color="#841584" />
      </View>: <>
        <Text style={{ fontSize: 24, textAlign: 'center', color: '#000' }}>
          Insert Data
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
              onPress={insertData}
              title="Save"
              color="#841584"
            />
          </View>
          <View style={styles.button}>
            <Button
              onPress={() => navigateToScreen('EditRecordScreen',{dictionary_word: word,dictionary_description: description, dictionary_pronunciation: pronunciation})}
              title="Edit"
              color="#841584"
            />
          </View>
          <View style={styles.button}>
            <Button
              onPress={() => navigateToScreen('ViewAllWordsScreen')}
              title="All Records"
              color="#841584"
            />
          </View>
          <View style={styles.button}>
            <Button
              onPress={() => navigateToScreen('SliderScreen')}
              title="Slider"
              color="#841584"
            />
          </View>
        </View></>}
     </View>
    </SafeAreaView>
  );
};

export default HomeScreen;

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
    margin: 10
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