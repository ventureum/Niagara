import { StyleSheet } from 'react-native'
import ventureum from '../../../theme/variables/ventureum'

const styles = StyleSheet.create({
  headerContainer: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'stretch'
  },
  userInfoContainer: {
    flexDirection: 'column',
    alignItems: 'stretch'
  },
  avatarContainer: {
    padding: ventureum.basicPadding,
    flexDirection: 'column',
    alignItems: 'center'
  },
  addressContainer: {
    padding: ventureum.basicPadding,
    flexDirection: 'column',
    alignItems: 'center'
  },
  wealthContainer: {
    padding: ventureum.basicPadding,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  listItemContainer: {

  }
})
export default styles
