import React from "react";
import PinCode from "../index";
// Note: test renderer must be required after react-native.
import renderer from "react-test-renderer";

it("renders correctly", () => {
	const tree = renderer.create(<PinCode navigation={this.props.navigation} />).toJSON();
	expect(tree).toMatchSnapshot();
});
