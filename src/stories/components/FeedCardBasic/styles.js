import { StyleSheet } from 'react-native'

const styles = StyleSheet.create({
  card: {
    paddingTop: 20,
    paddingBottom: 5,
    paddingLeft: 4,
    paddingRight: 4,
    borderBottomColor: '#bbb',
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: 'column',
    alignItems: 'stretch',
    flexWrap: 'wrap'
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 0
  },
  badgeCount: {
    fontSize: 12,
    paddingLeft: 5
  },
  footerIcons: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  header: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start'
  }
})

export default styles