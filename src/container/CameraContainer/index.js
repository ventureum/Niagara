// @flow
import * as React from "react";
import Camera from "../../stories/screens/Camera";
export interface Props {
  navigation: any,
}
export interface State {}
export default class CameraContainer extends React.Component<Props, State> {
  render() {
    return <Camera navigation={this.props.navigation} />;
  }
}
