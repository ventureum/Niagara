import { StyleSheet } from 'react-native'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'stretch',
    justifyContent: 'space-between'
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 16,
    paddingRight: 16,
    paddingBottom: 12,
    paddingTop: 8,
    borderBottomWidth: 1,
    borderColor: '#cecece'
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center'
  }
})

export default styles
