import React from 'react'
import Login from '../index'
// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer'

it('renders correctly', () => {
  const tree = renderer.create(<Login navigation={this.props.navigation} />).toJSON()
  expect(tree).toMatchSnapshot()
})
