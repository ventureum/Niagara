import { StyleSheet } from 'react-native'
import ventureum from '../../../theme/variables/ventureum'

const styles = StyleSheet.create({
  card: {
    paddingTop: 20,
    paddingBottom: 5,
    paddingLeft: ventureum.basicPadding * 2,
    paddingRight: ventureum.basicPadding * 2,
    borderBottomColor: '#bbb',
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: 'column',
    alignItems: 'stretch'
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
  },
  footerVoteInfo: {
    flex: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingRight: ventureum.basicPadding
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
    justifyContent: 'flex-start',
    paddingLeft: ventureum.basicPadding
  },
  replyButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  votingButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around'
  },
  footerIconStyle: {
    fontSize: 18
  }
})

export default styles
