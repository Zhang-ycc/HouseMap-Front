import AsyncStorage from '@react-native-async-storage/async-storage';
import Storage from 'react-native-storage';

export const storage = new Storage({
  size: 1000,
  storageBackend: AsyncStorage,
  // 数据过期时间，设为null则永不过期
  defaultExpires: 7 * 1000 * 3600 * 24,
  enableCache: true,
});
