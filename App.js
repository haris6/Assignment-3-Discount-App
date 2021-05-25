import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity,ScrollView,Alert } from 'react-native';
import { NavigationContainer,useFocusEffect } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { FontAwesome5,AntDesign,Ionicons } from '@expo/vector-icons';
import { DataTable } from 'react-native-paper'; 

const startScreen = ({ navigation, route }) => {
  const [Price, setPrice] = useState('');
  const [Disc, setDisc] = useState('');
  const [Save, setSave] = useState(false);
  const [myArray,setMyArray] = useState([]);
  const [index,setIndex] = useState(0);
  
  useEffect(() => {
    if (route.params?.theArray) {
      setMyArray(route.params?.theArray)
    }
  }, [route.params?.theArray]); 

  navigation.setOptions({
    headerRight: () => (
      <TouchableOpacity 
        style={{
          width: 110,
          marginRight:10,
          alignItems: 'center',
          backgroundColor: '#F1C40F',
          borderRadius: 10,
        }}
        onPress={() => navigation.navigate('History',{myArray})}>
        <Text
          style={{
            color: 'black',
            margin: 3,
          }}>
          <FontAwesome5 name="history" size={24} color="black" />
        </Text>
      </TouchableOpacity>
    ),
  });

  const Store = () => {
    var finalPrice = parseFloat(Price-((Disc/100)*Price)).toFixed(2); 
    const myObj = {
      Price,
      Disc,
      finalPrice,
      index
    }
    setMyArray([...myArray,myObj])
    setSave(true);
    setIndex(index+1);
  }

  const Calculate = (n) => {
    var a = Disc/100;
    var save = a * Price;
    var final = Price - save;
    if(n == "s"){
      return save;
    }
    if(n == "f"){
      return final;
    } 
  };

  const checkPrice = (a) => {
    if (a >= 0) {
      setPrice(a);
      setSave(false);
    }  
  };

  const checkDisc = (a) => {    
    if (a >= 0 && a <= 100) {
      setDisc(a);
      setSave(false); 
    }    
  };

  return (
    <View style={styles.container}>
      <View style={styles.box}>
        <Text 
          style={{
            fontSize:30, 
            margin:20,
            marginTop:40, 
            color:"#F1C40F",
            textAlign:'center', 
            fontWeight:"bold"
          }}>
          Discount Calculator
        </Text>
        <TextInput
          style={styles.input}
          onChangeText={(n) => {
            checkPrice(n);
          }}
          value={Price}
          placeholder="Enter Price"
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          onChangeText={(n) => {
            checkDisc(n);
          }}
          value={Disc}
          placeholder="Enter Discount %"
          keyboardType="numeric"
        />
        <Text style={styles.display}>
          You Save   :   $ {parseFloat(Calculate('s')).toFixed(2)}
        </Text>
        <Text style={styles.display}>
          Final Price   :   $ {parseFloat(Calculate('f')).toFixed(2)}
        </Text>
      </View>
      <TouchableOpacity
        style={{
          backgroundColor: Save ? 'lightgray' : '#212F3D',
          borderRadius: 15,
          margin: 60,
          width: 200,
          height: 35,
          alignItems: 'center',
          justifyContent: 'center',
        }}
        disabled={Save}
        onPress={()=>{Store()}}>
        <Text
          style={{
            color: Save ? 'grey' : '#F1C40F',
            fontWeight: 'bold',
            fontSize: 20,
            marginBottom:5,
          }}> 
          Save
        </Text>
      </TouchableOpacity>
    </View>
  );
}; 

const theHistory = ({navigation,route}) => {
  const [theArray,setTheArray] = useState([])

  useEffect(() => {
    if (route.params?.myArray) { 
      setTheArray(route.params?.myArray)
    }
  }, [route.params?.myArray]);

  const Delete = (index) => {
    var list = theArray.filter((n) => n.index != index);
    setTheArray(list);
  };

  const clearAlert = () =>{
    Alert.alert(
      'Clear History',
      'Are you sure you want to Clear History?',
      [
        {
          text:'Cancel',
          onPress:()=>{},
          style:'cancel'
        },
        {},
        {
          text:'Yes Im sure',
          onPress:()=>{clearAll()},
          style:'destructive',
        }
      ]
    )
  }

  const clearAll = () => {
    setTheArray([]);
  }

  navigation.setOptions({
    headerRight: () => (
      <TouchableOpacity
        style={{
          width: 110,
          marginRight:10,
          alignItems: 'center',
          backgroundColor: '#F1C40F',
          borderRadius: 10,
        }}
        onPress={()=>{clearAlert()}}>
        <Text
          style={{
            color: 'black',
            margin: 3,
          }}>
          <AntDesign name="delete" fontWeight='bold' size={24} color="black" />
        </Text>
      </TouchableOpacity>
    ),
    headerLeft: ()=>(
      <TouchableOpacity
        style={{
          width: 30,
          marginLeft:10,
          alignItems: 'center',
          color:'#F1C40F'
        }}
        onPress={() => navigation.navigate('Dashboard',{theArray})}>
        <Text>
          <Ionicons name="md-arrow-back" size={24} color='#F1C40F'/>
        </Text>
      </TouchableOpacity>
    )
  });
  return(
    <View style={{flex: 1,backgroundColor: '#F7F9F9'}}>
      <DataTable style={{marginTop:30}}>
        <DataTable.Header>
          <DataTable.Title><Text style={{fontWeight:'bold',fontSize:15}}>Original Price</Text></DataTable.Title>
          <DataTable.Title><Text style={{fontWeight:'bold',fontSize:15}}>Discount</Text></DataTable.Title>
          <DataTable.Title><Text style={{fontWeight:'bold',fontSize:15}}>Final Price</Text></DataTable.Title>
          <DataTable.Title><Text style={{fontWeight:'bold',fontSize:15}}>Edit</Text></DataTable.Title>
        </DataTable.Header>
        <ScrollView>
          {theArray.map((n)=>{
            return(
              <DataTable.Row>
                <DataTable.Cell>$ {n.Price}</DataTable.Cell>
                <DataTable.Cell>{n.Disc} %</DataTable.Cell>
                <DataTable.Cell>$ {n.finalPrice}</DataTable.Cell>
                <DataTable.Cell>
                  <TouchableOpacity
                    style={{
                      backgroundColor:'#F1C40F',
                      borderRadius: 15,
                      margin:1,
                      width: 80,
                      height: 25,
                      alignItems: 'center',
                      alignContent:'center',
                      justifyContent: 'center',
                    }}
                    onPress={()=>{Delete(n.index)}}>
                    <Text
                      style={{
                        color: 'black',
                        fontWeight: 'bold',
                        fontSize: 15,
                      }}> 
                      Delete
                    </Text>
                  </TouchableOpacity>
                </DataTable.Cell>
              </DataTable.Row>
            );
          })}
        </ScrollView>   
      </DataTable>
    </View>
  );
};

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Dashboard"
          component={startScreen}
          options={{
            headerTitleStyle: {
              fontWeight: 'bold',
              color: '#F1C40F',
              margin: 5,
              fontSize: 30,
            },
            headerStyle: {
              backgroundColor: '#212F3D',
              height: 100, 
            },
          }}
        />
        <Stack.Screen 
          name="History" 
          component={theHistory}
          options={{
            headerTitleStyle: {
              fontWeight: 'bold',
              color: '#F1C40F',
              margin: 5,
              marginLeft:0,
              fontSize: 30,
            },
            headerStyle: {
              backgroundColor: '#212F3D',
              height: 100,
            },
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F9F9',
    alignItems: 'center',
    justifyContent: 'center',
  },

  box: {
    borderRadius: 25,
    backgroundColor: '#212F3D',
  },

  input: {
    color: '#1C2833',
    fontWeight: 'bold',
    height: 30,
    margin: 30,
    textAlign: 'center',
    fontSize: 15,
    borderWidth: 3,
    borderColor: '#F1C40F',
    borderRadius: 10,
    backgroundColor: '#fff',
    marginBottom: 10,
  },

  display: {
    color: '#F1C40F',
    width: 200,
    fontSize: 15,
    fontWeight: 'bold',
    marginLeft: 70,
    marginRight: 50,
    marginBottom: 20,
    marginTop: 20,
  },
});
