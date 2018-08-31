import ventureum from '../../../theme/variables/ventureum.js'

const styles = {
  modalViewContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'stretch',
    flex: 1
  },
  messageContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'stretch',
    backgroundColor: ventureum.primaryColor,
    marginHorizontal: ventureum.basicPadding * 2,
    paddingVertical: ventureum.basicPadding,
    paddingHorizontal: ventureum.basicPadding * 2,
    borderRadius: ventureum.borderRadiusBase
  },
  headerContainer: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    paddingVertical: ventureum.basicPadding
  },
  bodyContainer: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingVertical: ventureum.basicPadding
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingVertical: ventureum.basicPadding
  },
  title: {
    fontSize: ventureum.componentTitleFontSize,
    color: ventureum.textOnPrimary
  },
  messageText: {
    fontSize: ventureum.paragraphFontSize,
    color: ventureum.subTextOnPrimary
  },
  buttonText: {
    color: ventureum.darkSecondaryColor,
    fontSize: ventureum.listTitleFontSize
  },
  button: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    margin: ventureum.basicPadding
  },
  modalBackground: {
    backgroundColor: 'black',
    opacity: 0.3,
    flex: 1,
    position: 'absolute'
  },
  modelView: {
    flex: 1,
    flexDirectionL: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'red'
  },
  modelMessage: {
    backgroundColor: 'white'
  }
}
export default styles
