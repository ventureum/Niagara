import * as React from 'react'
import {
  Content,
  Text,
  List,
  ListItem
} from 'native-base'
import styles from './styles'
export interface Props {
  navigation: any;
  list: any;
}
export interface State {}
class Vote extends React.Component<Props, State> {
  render () {
    return (
      <Content>
        <List>
          {this.props.list &&
            typeof (this.props.list.votingList) === typeof ([]) &&
            this.props.list.votingList.map((item, i) => (
              <ListItem
                key={i}
                onPress={() =>
                  this.props.navigation.navigate('BlankPage', {
                    name: { item }
                  })}
              >
                <Text>{item}</Text>
              </ListItem>
            ))}
        </List>
      </Content>
    )
  }
}

export default Vote
