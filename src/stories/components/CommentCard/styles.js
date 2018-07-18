import { StyleSheet } from 'react-native'

const styles = StyleSheet.create({
  card: {
    flex: 1,
    paddingTop: 20,
    paddingBottom: 5,
    paddingLeft: 10,
    paddingRight: 10,
    borderBottomColor: '#bbb',
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row'
  },
  avatarContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-start'
  },
  ContentContainer: {
    flex: 7,
    flexDirection: 'column',
    alignItems: 'stretch',
    paddingLeft: 15
  },
  authorContainer: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'stretch',
    justifyContent: 'flex-start',
    flexWrap: 'wrap'
  },
  commentContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
    paddingTop: 7,
    paddingRight: 10
  },
  authorText: {
    fontSize: 17
  }
})

export default styles
