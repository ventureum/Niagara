import ventureum from '../../../theme/variables/ventureum'

const styles = {
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'stretch',
    justifyContent: 'space-between'
  },
  content: {
    backgroundColor: 'white'
  },
  footer: {
    alignSelf: 'stretch',
    height: ventureum.basicPadding * 7,
    flexDirection: 'row',
    alignItems: 'center',
    borderTopColor: '#e9e9e9',
    justifyContent: 'flex-end',
    borderTopWidth: ventureum.borderWidth
  },
  iconStyle: {
    fontSize: 20,
    color: ventureum.defaultIconColor
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: ventureum.basicPadding,
    marginRight: ventureum.basicPadding * 2
  },
  iconText: {
    fontSize: 16,
    color: ventureum.subTextOnPrimary,
    marginLeft: ventureum.basicPadding
  },
  commentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: ventureum.basicPadding,
    backgroundColor: '#fafafa',
    marginRight: ventureum.basicPadding,
    marginLeft: ventureum.basicPadding,
    flex: 1
  },
  commentPlaceHolder: {
    color: '#a8a8a8',
    fontSize: ventureum.subTextFontSize,
    marginLeft: ventureum.basicPadding
  },
  commentDivider: {
    flexDirection: 'column',
    justifyContent: 'flex-end',
    height: 40,
    marginLeft: ventureum.basicPadding * 2,
    marginBottom: ventureum.basicPadding
  },
  commentDividerText: {
    fontSize: 12,
    color: '#333333',
    fontWeight: ventureum.bold
  },
  fill: {
    flex: 1,
    backgroundColor: 'white'
  }
}

export default styles
