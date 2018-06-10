import React from "react";
import CreateWallet from "../index";
// Note: test renderer must be required after react-native.
import renderer from "react-test-renderer";

it("renders correctly", () => {
	const tree = renderer.create(<CreateWallet navigation={this.props.navigation} />).toJSON();
	expect(tree).toMatchSnapshot();
});
