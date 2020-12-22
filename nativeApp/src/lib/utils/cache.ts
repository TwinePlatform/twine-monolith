import AsyncStorage from '@react-native-community/async-storage';

export const cacheLog = async (values) => {
    let cachevalue;
    let cachevalueString = await AsyncStorage.getItem('log cache');
    cachevalue = cachevalueString == null ? [] : JSON.parse(cachevalue);
    cachevalue.push(values);
    await AsyncStorage.setItem(
      'log cache',
      JSON.stringify(cachevalue)
    );
  }

export const cacheEditedLog = async (values) => {
    let cacheValueString = await AsyncStorage.getItem('edit log cache');
    let cachevalue;
    if (cacheValueString == null)
      cachevalue = [];
    else
      cachevalue = JSON.parse(cachevalue);

    cachevalue.push(values);
    await AsyncStorage.setItem(
      'edit log cache',
      JSON.stringify(cachevalue)
    );
  }