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
    justifyContent: 'space-between',
    paddingLeft: 20,
    paddingRight: 30
  },
  badgeCount: {
    fontSize: 12,
    paddingLeft: 5
  },
  footerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around'
  },
  header: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingRight: 5
  }
})

export default styles
