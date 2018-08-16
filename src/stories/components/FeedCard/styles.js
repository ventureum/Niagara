import { StyleSheet } from 'react-native'

const styles = StyleSheet.create({
  card: {
    paddingTop: 20,
    paddingBottom: 5,
    paddingLeft: 15,
    paddingRight: 15,
    borderBottomColor: '#bbb',
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: 'column',
    alignItems: 'stretch'
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
    justifyContent: 'space-between'
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
    color: 'black'
  }
})

export default styles
