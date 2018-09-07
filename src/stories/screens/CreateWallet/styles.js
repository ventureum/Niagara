import { StyleSheet } from 'react-native'
import ventureum from '../../../theme/variables/ventureum'

const styles: any = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
    flex: 1,
    justifyContent: 'space-between',
    paddingBottom: 15
  },
  explanatoryTextContainer: {
    height: 80,
    justifyContent: 'center',
    paddingHorizontal: 50,
    paddingTop: ventureum.basicPadding * 3
  },
  explanatoryText: {
    color: ventureum.textOnPrimary,
    fontSize: 13,
    textAlign: 'center'
  },
  dotsContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 15
  },
  dot: {
    height: 20,
    width: 20,
    marginHorizontal: 10
  },
  background: {
    flex: 1
  },
  header: {
    backgroundColor: '#090909'
  },
  title: {
    color: '#Fff'
  }
})

export default styles
