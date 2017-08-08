import React, { Component } from 'react';
import { View, Text, StyleSheet, Platform, Keyboard, ListView } from 'react-native';
import Header from './header';
import Footer from './footer';
import Row from './row';

class App extends Component {
  constructor() {
    super();

    const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });

    this.state = {
      value: '',
      items: [],
      allComplete: false,
      dataSource: ds.cloneWithRows([])
    };

    this.handleAddItem = this.handleAddItem.bind(this);
    this.onToggleAllComplete = this.onToggleAllComplete.bind(this);
    this.setSource = this.setSource.bind(this);
  }

  handleAddItem() {
    const { value, items } = this.state;

    if (!value) return;

    const newItems = [
      ...items,
      {
        key: Date.now(),
        text: value,
        complete: false
      }
    ];

    this.setSource(newItems, newItems, { value: '' });
  }

  onToggleAllComplete() {
    const complete = !this.state.allComplete;
    const newItems = this.state.items.map((item) => {
      return {
        ...item,
        complete
      }
    });

    this.setSource(newItems, newItems, { allComplete: true });
  }

  setSource(items, itemsDataSource, otherState = {}) {
    this.setState({
      items,
      dataSource: this.state.dataSource.cloneWithRows(itemsDataSource),
      ...otherState
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <Header
          value={this.state.value}
          onAddItem={this.handleAddItem}
          onChange={value => this.setState({ value })}
          onToggleAllComplete={this.onToggleAllComplete}
        />
        <View style={styles.content}>
          <ListView
            style={styles.list}
            enableEmptySections
            dataSource={this.state.dataSource}
            onScroll={() => Keyboard.dismiss()}
            renderRow={({ key, ...value }) => {
              return (
                <Row
                  key={key}
                  {...value}
                />
              );
            }}
            renderSeparator={(sectionId, rowId) => {
              return <View key={rowId} style={styles.separator}  />
            }}
          />
        </View>
        <Footer/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    ...Platform.select({
      ios: {
        paddingTop: 30
      }
    })
  },
  content: {
    flex: 1
  },
  list: {
    backgroundColor: '#FFF'
  },
  separator: {
    borderWidth: 1,
    borderColor: '#F5F5F5'
  }
});

export default App;