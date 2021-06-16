import AsyncStorage from '@react-native-async-storage/async-storage';
import { createLog, updateLog } from '../../redux/entities/logs';

const retrieveLogCache = async (storageName) => {
  let cacheValueString = await AsyncStorage.getItem(storageName);
  return cacheValueString == null ? [] : JSON.parse(cacheValueString);
}

export const cacheLog = async (values) => {
    let cacheValue = await retrieveLogCache('log cache');
    cacheValue.push(values);
    await AsyncStorage.setItem(
      'log cache',
      JSON.stringify(cacheValue)
    );
}

export const cacheEditedLog = async (values) => {
    let cacheValue = await retrieveLogCache('edit log cache');
    cacheValue.push(values);
    await AsyncStorage.setItem(
      'edit log cache',
      JSON.stringify(cacheValue)
    );
}

export const attemptToEmptyLogCache = async (dispatch) => {
  const logCache: any[] = await retrieveLogCache('log cache');
  const editLogCache: any[] = await retrieveLogCache('edit log cache');

  let newLogCache = [];

  logCache.forEach(item=>{
    createLog(item)(dispatch).then((result) => {
      if (result.status != 200) 
        newLogCache.push(item);
    });
  })

  let newEditLogCache = [];

  editLogCache.forEach(item=>{
    const { userId, logId } = item;
    delete item.userId;
    delete item.logId;
    updateLog(userId, logId, item)(dispatch).then((result) => {
      if (result.status != 200) 
        newEditLogCache.push(item);
    });
  });

  AsyncStorage.setItem(
    'log cache',
    JSON.stringify(newLogCache)
  );

  AsyncStorage.setItem(
    'edit log cache',
    JSON.stringify(newEditLogCache)
  );
}