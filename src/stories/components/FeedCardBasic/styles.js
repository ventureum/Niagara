import { StyleSheet } from 'react-native'
import ventureum from '../../../theme/variables/ventureum'

const styles = StyleSheet.create({
  card: {
    marginTop: ventureum.basicPadding * 2,
    marginLeft: ventureum.basicPadding * 2,
    marginRight: ventureum.basicPadding * 2,
    marginBottom: ventureum.basicPadding * 2,
    borderRadius: 15,
    borderColor: '#bbb',
    borderWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: 2,
    flexDirection: 'column',
    backgroundColor: '#f8f8f8',
    alignItems: 'stretch',
    flexWrap: 'wrap',
    paddingBottom: ventureum.basicPadding - 4
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: ventureum.basicPadding,
    paddingRight: ventureum.basicPadding,
    alignItems: 'center'
  },
  badgeCount: {
    fontSize: 14,
    paddingLeft: ventureum.basicPadding
  },
  footerVoteInfo: {
    flex: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: ventureum.basicPadding
  },
  footerRewardInfo: {
    flex: 2,
    borderLeftWidth: StyleSheet.hairlineWidth,
    borderRightWidth: StyleSheet.hairlineWidth,
    borderColor: ventureum.borderColor,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: ventureum.basicPadding
  },
  footerReplyInfo: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: ventureum.basicPadding
  },
  replyButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: ventureum.basicPadding
  },
  votingButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around'
  },
  footerIconStyle: {
    fontSize: 20
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
