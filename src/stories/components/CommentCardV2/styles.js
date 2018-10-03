import ventureum from '../../../theme/variables/ventureum'

const styles = {
  container: {
    marginHorizontal: ventureum.basicPadding * 2,
    paddingVertical: ventureum.basicPadding * 2,
    borderBottomColor: '#e9e9e9',
    borderBottomWidth: ventureum.borderWidth
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  username: {
    marginHorizontal: ventureum.basicPadding,
    fontSize: ventureum.subTextFontSize,
    color: '#333333',
    fontWeight: ventureum.medium
  },
  time: {
    fontSize: ventureum.subTextFontSize,
    color: '#A8A8A8'
  },
  body: {
    marginTop: ventureum.basicPadding,
    paddingLeft: ventureum.basicPadding * 3
  },
  bodyText: {
    fontSize: ventureum.paragraphFontSize,
    color: '#666666'
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: ventureum.basicPadding * 2,
    marginLeft: ventureum.basicPadding
  },
  icon: {
    fontSize: 18,
    color: ventureum.defaultIconColor
  },
  iconText: {
    fontSize: ventureum.paragraphFontSize,
    color: ventureum.defaultIconColor,
    marginLeft: ventureum.basicPadding
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end'
  }
}

export default styles
