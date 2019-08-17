import { Dimensions } from 'react-native';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

export default {
  window: {
    width,
    height,
  },
  isSmallDevice: width < 375,
  color: {
    primaryColor: '#F25E00',
    primaryDarkColor: '#222222',
    secondaryColor: '#8D8D8D',
    disabledColor: '#F1F9FF',
    lightTextColor: '#FFF',
    darkTextColor: '#000',
    negativeTextColor: '#ff2f00',
  },

};
