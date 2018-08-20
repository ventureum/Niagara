import { StyleSheet } from 'react-native'
import ventureum from '../../../theme/variables/ventureum'

const styles: any = StyleSheet.create({
  listContent: {
    fontSize: 14,
    color: 'black'
  },
  footerButton: {
    backgroundColor: ventureum.lightSecondaryColor,
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center'
  },
  headerContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  headerInfo: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: ventureum.primaryColor
  }
})
export default styles
