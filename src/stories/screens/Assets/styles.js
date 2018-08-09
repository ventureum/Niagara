import { StyleSheet, Platform } from 'react-native'

const styles: any = StyleSheet.create({
  container: {
    backgroundColor: 'white'
  },
  textContent: {
    fontSize: 14,
    color: Platform.OS === 'ios' ? 'black' : 'white'
  }
})
export default styles
