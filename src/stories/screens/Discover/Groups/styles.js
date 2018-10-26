import ventureum from '../../../../theme/variables/ventureum'

const styles = {
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: ventureum.basicPadding * 2,
    borderBottomWidth: ventureum.borderWidth,
    borderBottomColor: '#E9E9E9'
  },
  initialsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E9E9E9',
    height: 32,
    width: 32,
    borderRadius: 32,
    marginRight: ventureum.basicPadding
  },
  initials: {
    fontSize: 10,
    color: '#666666',
    fontWeight: 'bold'
  },
  boardName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333333'
  }
}

export default styles
