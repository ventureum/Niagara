import { StyleSheet } from 'react-native'
import ventureum from '../../../theme/variables/ventureum'

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white'
  },
  content: {
    flexDirection: 'column',
    alignItems: 'stretch',
    padding: 10
  },
  postTitle: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#8c8c8c',
    alignItems: 'center',
    paddingBottom: 10
  },
  headerButtonText: {
    fontSize: ventureum.pageTitleFontSize,
    color: ventureum.secondaryColor,
    fontWeight: ventureum.lessBold
  },
  replyButton: {
    paddingRight: ventureum.basicPadding,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  }
})

export default styles
