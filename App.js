import { Fragment, Alert, Button, SafeAreaView, StyleSheet, Text, View, StatusBar, TextInput, FlatList, Touchable, TouchableOpacity } from 'react-native';
import colors from './app/config/colors';
import { Appbar, List, Snackbar } from 'react-native-paper';
import AppPaperProvider from './app/config/appTheme';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useEffect, useReducer, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
// import RNFS  from 'react-native-fs';
import XLSX from 'xlsx';
import { shareAsync } from 'expo-sharing';
import ExcelJS from 'exceljs';
import { Buffer as NodeBuffer } from 'buffer';
import { AppSnackBar, useSnackBar } from './app/appSnackbar';

export default function App() {
  const Stack = createNativeStackNavigator();
  console.log('App executed');
  return (
    <AppPaperProvider>
      <AppSnackBar>

        <NavigationContainer>
          <Stack.Navigator initialRouteName='Home'>
            <Stack.Screen name="Home" component={HomeScreen} options={{
              title: 'MoneyyApp Excel',
              headerShown: false,
              statusBarColor: colors.primaryContainer,
              statusBarStyle: 'dark',
            }} />
            <Stack.Screen name="Home2" component={HomeScreen} options={{
              title: 'MoneyyApp Excel',
              headerShown: false,
              statusBarColor: colors.primaryContainer,
              statusBarStyle: 'dark',
            }} />
          </Stack.Navigator>
        </NavigationContainer>
      </AppSnackBar>

    </AppPaperProvider>
  );
}

function HomeScreen({ navigation }) {
  const [Data, setData] = useState([])

  var snackbarContext = useSnackBar();
  const createExcel = async () => {
    try {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('My Sheet');
      for (let i = 0; i < 10; i++) {
        var r = await AsyncStorage.multiGet(Data[i].columnIds.map((v) => v.id));
        // console.log(r.map((v)=>{
        //   if (v[1]===null) {
        //     return '';
        //   }
        //   return v[1];
        // }));
        worksheet.addRow(r.map((v) => v[1]));
      }
      var path = FileSystem.cacheDirectory + 'my_exported_file.xlsx';
      console.log(path);
      await workbook.xlsx.writeBuffer().then((buffer) => {
        // Do this to use base64 encoding
        const nodeBuffer = NodeBuffer.from(buffer);
        const bufferStr = nodeBuffer.toString('base64');
        FileSystem.writeAsStringAsync(path, bufferStr, {
          encoding: FileSystem.EncodingType.Base64
        }).then(() => {
          shareAsync(path);
        });
      });
    }
    catch (e) {
      snackbarContext.showSnackBar('Error creating excel');
    }


  }
  useEffect(() => {
    var data = [];
    for (let i = 0; i < 10; i++) {
      var row = {
        id: i + 1,
        columnIds: []
      };
      for (let j = 0; j < 5; j++) {
        row.columnIds.push({
          id: i + '-' + j,
        })
      }
      data.push(row);
    }
    setData(data);
  }, [])


  return (

    <>
      <Appbar.Header style={styles.statusBar}>
        <Appbar.Content title="MoneyyApp Excel" />
        <Appbar.Action icon="download" onPress={() => {
          // navigation.navigate('Home2');
          // AsyncStorage.clear();
          // exportDataToExcel();
          createExcel();
        }} />
      </Appbar.Header>

      <View style={styles.body}>
        <Header />

        <FlatList
          data={Data}
          length={241}
          renderItem={({ item }) => {
            return <Row key={item.id} id={item.id} columnIds={item.columnIds} ></Row>;
          }}
        />
      </View>
    </>
  );
}


const Header = ({ }) => {
  return (
    <View style={styles.row}>
      <View style={{ ...styles.cell, ...styles.header, backgroundColor: colors.tertiary }} />
      <View style={{ ...styles.cell, ...styles.header }}><Text>A</Text></View>
      <View style={{ ...styles.cell, ...styles.header }}><Text>B</Text></View>
      <View style={{ ...styles.cell, ...styles.header }}><Text>C</Text></View>
      <View style={{ ...styles.cell, ...styles.header }}><Text>D</Text></View>
      <View style={{ ...styles.cell, ...styles.header }}><Text>E</Text></View>
    </View>
  )
}

const Cell = ({ id }) => {
  const [value, onChangeText] = useState("");
  const [isEditing, setisEditing] = useState(false);
  var snackbarContext = useSnackBar();

  const _storeData = async ({ key, value }) => {

    try {
      await AsyncStorage.setItem(
        key,
        value,
      );
    } catch (error) {
      // Error saving data
      snackbarContext.showSnackBar('Error saving data');
    }
  };
  const _retrieveData = async (key) => {
    try {
      const v = await AsyncStorage.getItem(key);
      if (v !== null) {
        onChangeText(v)
      }
    } catch (error) {
      // snackbarContext.showSnackBar('Error retriving data');

    }
  };

  useEffect(() => {
    _retrieveData(id).then((v) => {
    });
  }, [])

  return (
    <View style={{
      ...styles.cell,
      ...(isEditing ? styles.seletedCell : {})

    }}  >
      {
        isEditing ?
          <TextInput onBlur={
            (e) => {
              _storeData({ key: id, value: value })
              setisEditing(false);
            }
          }

            autoFocus={true}
            value={value}
            onChangeText={onChangeText}
            style={styles.cellInput}
            selectionColor={colors.secondary}

          >
          </TextInput>
          :
          <TouchableOpacity
            style={styles.cellText}
            onPress={
              () => {
                setisEditing(true);
              }
            } >
            <Text>{value}</Text>
          </TouchableOpacity>
      }

    </View>
  )
}
const Row = ({ id, columnIds }) => {
  return (
    <View style={styles.row}>
      <View style={{ ...styles.cell, ...styles.header }} ><Text>{id}</Text></View>
      {columnIds.map((item) => {
        return <Cell key={item.id} id={item.id} />
      })}
    </View>
  )
}






const styles = StyleSheet.create({
  statusBar: {
    backgroundColor: colors.primaryContainer,

  },
  container: {
    flex: 1,
    backgroundColor: colors.primary,
    // justifyContent: 'center',
    alignItems: 'center'

  },
  body: {
    flex: 1,
    backgroundColor: colors.secondaryContainer,
  },
  row: {
    // flex: 1,
    flexDirection: 'row',
    // maxHeight: 35,
    minHeight: 28,

  },
  cell: {
    flex: 1,
    borderColor: colors.secondary,
    borderWidth: 0.3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    backgroundColor: colors.tertiaryContainer,
  },
  cellText: {
    flex: 1,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',

  },
  cellInput: {
    flex: 1,
    paddingLeft: 1,
    width: '100%',
    height: '100%',
  },
  seletedCell: {
    backgroundColor: colors.tertiaryContainer,
    borderColor: colors.primary,
  }
});
