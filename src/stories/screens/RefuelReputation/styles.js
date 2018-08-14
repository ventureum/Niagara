import { StyleSheet } from 'react-native'

const styles = StyleSheet.create({
  purchaseContainer: {
    flexDirection: 'column',
    padding: 20,
    borderWidth: 10,
    alignItems: 'stretch',
    backgroundColor: '#f9f9f9',
    justifyContent: 'space-around',
    borderColor: '#e2e0e0'
  },
  background: {
    backgroundColor: '#e2e0e0',
    height: '100%'
  },
  nameCard: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  transferButton: {
    backgroundColor: '#3db239',
    flexDirection: 'column',
    alignItems: 'center',
    paddingTop: 15,
    paddingBottom: 15
  },
  textContainer: {
    padding: 10,
    alignItems: 'center',
    flexDirection: 'row'
  }
})

export default styles
