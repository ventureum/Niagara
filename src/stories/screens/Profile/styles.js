import { StyleSheet } from 'react-native'

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingLeft: 15,
    paddingRight: 15,
    paddingBottom: 13,
    paddingTop: 10,
    borderBottomWidth: 1,
    borderColor: '#cecece'
  },
  headerText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black'
  },
  nameCardContainer: {
    paddingBottom: 20,
    paddingTop: 20,
    flexDirection: 'column',
    alignItems: 'stretch'
  },
  nameCard: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  paddingSpace: {
    height: 4,
    backgroundColor: '#dbdcdd'
  },
  reputationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center'
  }
})

export default styles
