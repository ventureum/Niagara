import { Platform, StyleSheet } from 'react-native'
import ventureum from '../../../theme/variables/ventureum'

export default {
  modalContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    backgroundColor: ventureum.primaryColor
  },
  avatarContainer: {
    paddingTop: Platform.OS === 'ios' ? 0 : 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-start'
  },
  infoContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingTop: 10
  },
  textInputContainer: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'stretch',
    paddingHorizontal: ventureum.basicPadding
  },
  headerButtonText: {
    fontSize: ventureum.pageTitleFontSize,
    color: ventureum.secondaryColor,
    fontWeight: ventureum.lessBold
  },
  divider: {
    paddingBottom: 1,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: ventureum.borderColor,
    flexDirection: 'column',
    justifyContent: 'flex-end'
  }
}
