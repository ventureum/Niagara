import { StyleSheet } from 'react-native'
import ventureum from '../../../theme/variables/ventureum'

const styles: any = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
    flex: 1,
    paddingBottom: 20,
    paddingHorizontal: 15,
    justifyContent: 'space-between'
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: ventureum.basicPadding * 5
  },
  logo: {
    width: '35%',
    height: '35%'
  },
  buttonsContainer: {
    paddingHorizontal: 15,
    width: '100%'
  },
  background: {
    flex: 1
  },
  appName: {
    color: 'black',
    fontWeight: ventureum.bold,
    fontSize: 32,
    marginTop: ventureum.basicPadding * 3
  }
})
export default styles
