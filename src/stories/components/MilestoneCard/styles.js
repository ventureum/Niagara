import { StyleSheet } from 'react-native'

const styles = StyleSheet.create({
  cardContainer: {
    borderWidth: 2,
    borderColor: '#9822ae',
    flexDirection: 'column',
    alignItems: 'stretch',
    padding: 12,
    borderRadius: 6
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  headerLeftTextContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    paddingLeft: 4
  },
  optionContainer: {
    borderWidth: 1,
    borderColor: '#9822ae',
    borderRadius: 8,
    padding: 8,
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginVertical: 4
  },
  formContainer: {
    marginVertical: 4,
    flexDirection: 'column',
    alignItems: 'stretch'
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingTop: 4
  },
  shadow: {
    elevation: 5,
    flexDirection: 'column',
    alignItems: 'stretch',
    borderRadius: 4,
    paddingTop: 4,
    paddingHorizontal: 4,
    marginBottom: 8
  },
  text1: {
    fontWeight: 'bold',
    fontSize: 12,
    color: '#474646'
  },
  text2: {
    fontSize: 10,
    color: '#878787'
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingRight: 36
  },
  textInput: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'stretch'
  }
})

export default styles
