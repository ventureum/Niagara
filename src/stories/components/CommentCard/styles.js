import { StyleSheet } from 'react-native'
import ventureum from '../../../theme/variables/ventureum'

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
  headerLeft: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'stretch',
    justifyContent: 'flex-start',
    flexWrap: 'wrap'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  commentContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
    paddingRight: ventureum.basicPadding
  },
  authorText: {
    fontSize: 17
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: ventureum.basicPadding,
    paddingRight: ventureum.basicPadding,
    alignItems: 'center'
  },
  footerVoteInfo: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingRight: ventureum.basicPadding
  },
  footerRewardInfo: {
    flex: 1,
    borderLeftWidth: StyleSheet.hairlineWidth,
    borderColor: ventureum.borderColor,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: ventureum.basicPadding
  },
  votingButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around'
  },
  footerIconStyle: {
    fontSize: 18
  },
  badgeCount: {
    fontSize: 14,
    paddingLeft: ventureum.basicPadding
  }
})

export default styles
