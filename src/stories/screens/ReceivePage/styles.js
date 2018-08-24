import ventureum from '../../../theme/variables/ventureum'

const styles = {
  container: {
    flex: 1,
    backgroundColor: ventureum.primaryColor
  },
  qrContainer: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    margin: ventureum.basicPadding,
    padding: ventureum.basicPadding * 2,
    ...ventureum.applyShadow
  }
}

export default styles
