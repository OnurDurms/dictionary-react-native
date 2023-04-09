import React, { useState, useEffect } from 'react';
import { SafeAreaView, Text, View, StyleSheet, Alert, TouchableOpacity, TextInput, FlatList } from 'react-native';
import { openDatabase } from 'react-native-sqlite-storage';

var db = openDatabase({ name: 'DictionaryWordDatabase.db' });

const ViewAllWordsScreen = ({ navigation }) => {

  const [items, setItems] = useState([]);
  const [empty, setEmpty] = useState([]);
  const [loadMoreData, setLoadMoreData] = useState(0);

  useEffect(() => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM dictionary_words order by id desc limit ' + (loadMoreData * 10) + ',' + ((loadMoreData + 1) * 10) ,
        [],
        (tx, results) => {
          let newDataArray = JSON.parse(JSON.stringify(items));
          for (let i = 0; i < results.rows.length; ++i){
            newDataArray.push(results.rows.item(i));
              if (results.rows.length >= 1) {
                setEmpty(false);
              } else {
                setEmpty(true)
              }
          }
          setItems(newDataArray);
        }
      );

    });
  }, [loadMoreData]);

  const listViewItemSeparator = () => {
    return (
      <View
        style={{
          height: 1,
          width: '100%',
          backgroundColor: '#000'
        }}
      />
    );
  };

  const emptyMSG = (status) => {
    return (
      <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>

        <Text style={{ fontSize: 25, textAlign: 'center' }}>
          No Record Inserted Database is Empty...
          </Text>

      </View>
    );
  }

  const navigateToEditScreen = (word, description, pronunciation) => {

    navigation.navigate('EditRecordScreen', {
      dictionary_word: word,
      dictionary_description: description,
      dictionary_pronunciation: pronunciation
    });
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        {empty ? emptyMSG(empty) :

          <FlatList
            data={items}
            ItemSeparatorComponent={listViewItemSeparator}
            keyExtractor={(item, index) => index.toString()}
            onEndReached={() => setLoadMoreData((old) => old + 1)}
            onEndReachedThreshold ={0.1}
            renderItem={({ item }) =>
              <View key={item.word} style={{ padding: 20 }}>
                <TouchableOpacity key={item.word} onPress={() => navigateToEditScreen(item.dictionary_word, item.dictionary_description, item.dictionary_pronunciation)} >
                  <Text style={styles.itemsStyle}> Word: {item.dictionary_word} </Text>
                  <Text style={styles.itemsStyle}> Description: {item.dictionary_description} </Text>
                  <Text style={styles.itemsStyle}> Pronunciation: {item.dictionary_pronunciation} </Text>
                </TouchableOpacity>
              </View>
            }
          />
        }
      </View>
    </SafeAreaView>

  );
}
export default ViewAllWordsScreen;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    alignItems: 'center',
    padding: 10,
  },

  touchableOpacity: {
    backgroundColor: '#0091EA',
    alignItems: 'center',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%'
  },

  touchableOpacityText: {
    color: '#FFFFFF',
    fontSize: 23,
    textAlign: 'center',
    padding: 8
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