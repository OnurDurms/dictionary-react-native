import React, { useState, useEffect } from "react"
import {
  ScrollView,
  Animated,
  SafeAreaView,
  ImageBackground,
  Dimensions,
  Text,
  View,
  TouchableOpacity
} from "react-native"

import { openDatabase } from 'react-native-sqlite-storage';

var db = openDatabase({ name: 'DictionaryWordDatabase.db' });

const OFFSET = 40
const ITEM_WIDTH = Dimensions.get("window").width - (OFFSET * 2)
const ITEM_HEIGHT = 200

const AdvancedCardCarousel = () => {
  const scrollX = React.useRef(new Animated.Value(0)).current

  const [items, setItems] = useState([]);
  const [showDescription, setShowDescription] = useState(false);
  const [empty, setEmpty] = useState([]);
  const [loadMoreData, setLoadMoreData] = useState(0);

  useEffect(() => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM dictionary_words order by id desc limit ' + (loadMoreData * 1) + ',' + ((loadMoreData + 1) * 1) ,
        [],
        (tx, results) => {
          let newDataArray = [];
          for (let i = 0; i < 1; ++i){
            newDataArray.push(results.rows.item(i));
              if (results.rows.length >= 1) {
                setEmpty(false);
              } else {
                setEmpty(true)
              }
          }
          setItems((old) => [...old,...newDataArray]);
        }
      );
    });
    if(showDescription){
        setShowDescription(false);
    }
  }, [loadMoreData]);
  return (
    <SafeAreaView style={{ flex: 1, display:"flex", justifyContent: "center", alignItems: "center",backgroundColor: "#ddd" }}>
      <ScrollView
        horizontal={true}
        decelerationRate={"normal"}
        snapToInterval={ITEM_WIDTH}
        onScrollEndDrag={() => setLoadMoreData((old) => old + 1)}
        style={{ marginTop: (Dimensions.get("window").height / 2 ) - 100, paddingHorizontal: 0 }}
        showsHorizontalScrollIndicator={false}
        bounces={false}
        disableIntervalMomentum
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={12}
      >
        {items.map((item, idx) => {
          const inputRange = [
            (idx - 1) * ITEM_WIDTH,
            idx * ITEM_WIDTH,
            (idx + 1) * ITEM_WIDTH,
          ]

          const translate = scrollX.interpolate({
            inputRange,
            outputRange: [0.85, 1, 0.85],
          })

          const opacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.5, 1, 0.5],
          })

          return (
          <TouchableOpacity key={idx} onPress={() => setShowDescription(!showDescription)}>
            <Animated.View
              style={{
                width: ITEM_WIDTH,
                height: ITEM_HEIGHT,
                marginLeft: idx === 0 ? OFFSET : undefined,
                marginRight: idx === items.length - 1 ? OFFSET : undefined,
                opacity: opacity,
                transform: [{ scale: translate }],
              }}

            >
              <ImageBackground
                style={{
                  flex: 1,
                  resizeMode: "cover",
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "grey"
                }}
                imageStyle={{ borderRadius: 6}}
              >
              {showDescription ?
                <Text
                  style={{
                       color: "#fff",
                    }}>
                  ({item.dictionary_pronunciation}){"\n"}
                  {item.dictionary_description}
                </Text>:
                <Text
                  style={{
                       color: "#fff",
                    }}>
                  {item.dictionary_word}
                </Text> }
                </ImageBackground>
            </Animated.View>
            </TouchableOpacity>

          )
        })}
      </ScrollView>
    </SafeAreaView>
  )
}

export default AdvancedCardCarousel;