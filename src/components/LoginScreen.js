import React, {useEffect} from 'react';
import { SafeAreaView, View, StyleSheet, Image } from 'react-native';

export default function Login({navigation}) {

  useEffect(() => {
    setTimeout(() => {
        navigation.navigate("HomeScreen");
    },3000)
  },[])

  return (
    <SafeAreaView style={{ flex: 1 }}>
          <View style={styles.mainContainer}>
              <Image
                style={styles.appLogo}
                source={require('../img/dictionary_icon.png')}
              />
          </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  appLogo:{

  }
});