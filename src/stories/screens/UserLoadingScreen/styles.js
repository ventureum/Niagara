import { StyleSheet } from 'react-native'
import ventureum from '../../../theme/variables/ventureum'

const styles: any = StyleSheet.create({
  logoContainer: {
    marginTop: ventureum.basicPadding * 5,
    alignItems: 'center',
    justifyContent: 'center'
  },
  logo: {
    width: '35%',
    height: '50%'
  },
  appName: {
    color: 'black',
    fontWeight: ventureum.bold,
    fontSize: 20,
    marginTop: ventureum.basicPadding * 3
  },
  container: {
    flex: 1,
    paddingHorizontal: ventureum.basicPadding * 6
  }
})
export default styles
