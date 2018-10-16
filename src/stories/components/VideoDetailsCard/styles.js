import ventureum from '../../../theme/variables/ventureum'

const styles = {
  container: {
    flexWrap: 'wrap',
    flexDirection: 'column',
    paddingBottom: ventureum.basicPadding * 2,
    borderBottomColor: '#e9e9e9',
    borderBottomWidth: ventureum.borderWidth
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
  metaInfoContainer: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: ventureum.basicPadding * 2
  },
  titleText: {
    fontSize: 14,
    color: '#333333',
    fontWeight: 'bold'
  },
  infoContainer: {
    marginHorizontal: ventureum.basicPadding * 2,
    marginTop: ventureum.basicPadding * 2
  }
}
export default styles
