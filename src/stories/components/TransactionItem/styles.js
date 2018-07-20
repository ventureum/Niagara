import { StyleSheet } from 'react-native'

export default {
  itemContainer: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'stretch',
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 5,
    paddingTop: 5,
    borderBottomColor: '#bbb',
    borderBottomWidth: StyleSheet.hairlineWidth
  },
  transactionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 90
  },
  fulfilledText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'green'
  },
  pendingText: {
    fontSize: 20,
    color: 'red'
  },
  hashText: {
    fontSize: 18,
    marginLeft: 8
  },
  hashContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  footer: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  receiptContainer: {
    flexDirection: 'column'
  }
}
