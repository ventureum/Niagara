import { StyleSheet } from 'react-native'

const styles = StyleSheet.create({
  card: {
    marginTop: 15,
    marginLeft: 15,
    marginRight: 15,
    marginBottom: 15,
    borderRadius: 15,
    borderColor: '#bbb',
    borderWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: 2,
    flexDirection: 'column',
    backgroundColor: '#f8f8f8',
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
    paddingTop: 10,
    paddingBottom: 5,
    paddingLeft: 20,
    paddingRight: 20
  },
  content: {
    paddingLeft: 20,
    paddingRight: 20
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
    color: 'black'
  }
})

styles.md = {
  paragraph: {
    marginTop: 0,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    overflow: 'hidden'
  }
}

export default styles
