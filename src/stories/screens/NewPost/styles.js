import { Platform } from 'react-native'

export default {
  modalContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'stretch'
  },
  avatarContainer: {
    paddingTop: Platform.OS === 'ios' ? 0 : 10,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-start'
  },
  infoContainer: {
    flex: 9,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingTop: 10,
    backgroundColor: '#f8f8f8'
  },
  textInputContainer: {
    flex: 6
  }
}
