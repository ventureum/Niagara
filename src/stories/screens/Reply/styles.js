import { StyleSheet } from 'react-native'

const styles = StyleSheet.create({
  replyContainer: {
    flexDirection: 'column',
    alignItems: 'stretch'
  },
  replyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 15,
    paddingRight: 15,
    paddingBottom: 13,
    paddingTop: 10,
    borderBottomWidth: 1,
    borderColor: '#cecece'
  },
  headerLeft: {
    flexDirection: 'row'
  },
  headerRight: {
    flexDirection: 'row'
  },
  postTitle: {
    flexDirection: 'row',
    paddingLeft: 15,
    borderBottomWidth: 1,
    borderColor: '#8c8c8c',
    padding: 10,
    alignItems: 'center'
  }
})

export default styles
