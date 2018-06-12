import React from 'react'
import RecoverWallet from '../index'
// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer'

it('renders correctly', () => {
  const tree = renderer.create(<RecoverWallet navigation={this.props.navigation} />).toJSON()
  expect(tree).toMatchSnapshot()
})
