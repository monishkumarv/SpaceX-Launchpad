import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ScrollView, Touchable, TouchableWithoutFeedback } from 'react-native';
import { useState, useEffect } from 'react';
import { AntDesign } from '@expo/vector-icons';


const Stack = createNativeStackNavigator();

export default function App() {       // App starts here. Contains two screen 'Home screen' and 'Second screen'

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: 'Launchpads' }}
        />
        <Stack.Screen name="Second" component={SecondScreen} options={{ title: 'Launch Details' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const HomeScreen = ({ navigation }) => {        // Home screen which displays all the launchpads in a list.

  var [response, setResponse] = useState(0);

  let fetchRes = fetch("https://api.spacexdata.com/v4/launchpads");     // get response for launchpad list.
  fetchRes.then(res =>
    res.json()).then(data => {
      setResponse(data);
    })

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <ScrollView>
        {
          response === 0 ? <Text>{"Loading"}</Text> : response.map((item) => {        // If response is still on process 'Loading' is displayed.
            return <ListItem item={item} key={item.name} navigation={navigation} />;
          })
        }
      </ScrollView>
    </View>
  );
}

const SecondScreen = ({ route, navigation }) => {     // Second screen which displays the details of a particular launch.

  var [response, setResponse] = useState(0);

  let fetchRes = fetch("https://api.spacexdata.com/v4/launches/" + route.params.launchId);    // get response for launch detail.
  fetchRes.then(res =>
    res.json()).then(data => {
      setResponse(data);
    });

  return (
    response === 0 ? <Text>{"Loading"}</Text> :             // If response is still on process 'Loading' is displayed.
      <View style={styles.container}>
        <View style={{ marginTop: 20, marginBottom: 16, marginHorizontal: 15, flexDirection: 'row' }}>
          <Text style={{ flex: 2, fontWeight: 'bold', fontSize: 20 }}>{"Name:  "}</Text>
          <Text style={{ flex: 5, fontSize: 20 }}>{response.name}</Text>
        </View>
        <View style={{ marginVertical: 16, marginHorizontal: 15, flexDirection: 'row' }}>
          <Text style={{ flex: 2, fontWeight: 'bold', fontSize: 20 }}>{"Details:  "}</Text>
          <Text style={{ fontSize: 20, flex: 5, flexWrap: 'wrap' }}>{response.details ? response.details : "None"}</Text>
        </View>
        <View style={{ marginVertical: 16, marginHorizontal: 15, flexDirection: 'row' }}>
          <Text style={{ flex: 2, fontWeight: 'bold', fontSize: 20 }}>{"Date:  "}</Text>
          <Text style={{ flex: 5, fontSize: 20 }}>{response.date_utc.slice(0, 10)}</Text>
        </View>
        <View style={{ marginVertical: 16, marginHorizontal: 15, flexDirection: 'row' }}>
          <Text style={{ flex: 2, fontWeight: 'bold', fontSize: 20 }}>{"Reused:  "}</Text>
          <Text style={{ flex: 5, fontSize: 20 }}>{JSON.stringify(response.cores[0].reused)}</Text>
        </View>
        <StatusBar style="auto" />
      </View>
  );
}

const ListItem = ({ item, navigation }) => {       // Each item in the launchpad list

  return (
    <View style={styles.listitem} key={item.name}>
      <Text style={styles.title}>{item.name}</Text>
      <Text style={{ marginBottom: 5, textAlign: 'justify' }}>{item.details}</Text>

      <View style={{ marginBottom: 5, flexDirection: 'row' }}>
        <Text style={{ fontWeight: 'bold' }}>{"Status:  "}</Text>
        <Text>{item.status}</Text>
      </View>
      {<LaunchList launchArray={item.launches} navigation={navigation} />}
    </View>
  );
}

const LaunchList = ({ launchArray, navigation }) => {       // Top 3 launches in the launchpad.

  if (launchArray.length === 0) {                   // if no launches are there then this is printed.
    return (<Text>{"No Launch Available"}</Text>);
  }

  const TopLaunches = launchArray.slice(0, Math.min(3, launchArray.length));

  //console.log(TopLaunches);

  return (<View>
    <Text style={{ paddingVertical: 3, fontWeight: 'bold' }}>{"Top Launches: "}</Text>
    {TopLaunches.map((launch) => {
      return (
        <TouchableWithoutFeedback key={launch} onPress={() => navigation.navigate('Second', { launchId: launch })}>
          <View key={launch} style={{ paddingVertical: 5, flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text>{launch}</Text>
            <AntDesign name='arrowright' size={15} />
          </View>
        </TouchableWithoutFeedback>
      );
    })}
  </View>);

}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  listitem: {
    marginHorizontal: 20,
    marginTop: 15,
    marginBottom: 10,
    paddingVertical: 20,
    paddingHorizontal: 15,
    shadowColor: '#000000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 30, height: 30 },
    backgroundColor: 'rgb(255,255,255)',
    elevation: 5,
    borderRadius: 10,
  },

  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5,
  }

});