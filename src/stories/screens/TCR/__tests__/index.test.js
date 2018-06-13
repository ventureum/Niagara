import React from 'react'
import TCR from '../index'
// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer'

it('renders correctly', () => {
  const tree = renderer.create(<TCR navigation={navigation} list={list} />).toJSON()
  expect(tree).toMatchSnapshot()
})
