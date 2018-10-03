import ventureum from '../../../theme/variables/ventureum'
const styles = {
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333'
  },
  text: {
    fontSize: 18,
    fontWeight: ventureum.normal,
    color: '#333333'
  },
  container: {
    flexWrap: 'wrap',
    paddingTop: ventureum.basicPadding,
    flexDirection: 'column'
  },
  header: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: ventureum.basicPadding,
    paddingHorizontal: ventureum.basicPadding * 2
  },
  metaInfo: {
    marginLeft: ventureum.basicPadding,
    flexDirection: 'column',
    justifyContent: 'flex-start'
  },
  usernameText: {
    color: '#333333',
    fontSize: ventureum.subTextFontSize,
    fontWeight: ventureum.medium
  },
  timeText: {
    color: '#999999',
    fontSize: ventureum.subTextFontSize,
    fontWeight: ventureum.normal
  },
  body: {
    flexWrap: 'wrap',
    paddingTop: ventureum.basicPadding,
    flexDirection: 'column',

    paddingHorizontal: ventureum.basicPadding * 2
  },
  footer: {
    alignSelf: 'stretch',
    height: ventureum.basicPadding * 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    backgroundColor: '#f7f7f7'
  },
  iconStyle: {
    fontSize: 24,
    color: ventureum.subTextOnPrimary
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  iconText: {
    fontSize: 16,
    color: ventureum.subTextOnPrimary,
    marginLeft: ventureum.basicPadding
  }
}
export default styles
