import RNFirebase from 'react-native-firebase';
const configurationOptions = {
  debug: true,
  persistence: true
};
const Firebase = RNFirebase.initializeApp(configurationOptions);
export default Firebase;
