import React, { Component } from 'react';
import { View, Text, StyleSheet, Platform, Keyboard, ListView } from 'react-native';
import Header from './header';
import Footer from './footer';
import Row from './row';

const filterItems = (filter, items) => {
  return items.filter((item) => {
    if (filter === 'ALL') {
      return true;
    } else if (filter === 'ACTIVE') {
      return !item.complete;
    } else if (filter === 'COMPLETED') {
      return item.complete;
    }
  });
};

class App extends Component {
  constructor() {
    super();

    const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });

    this.state = {
      value: '',
      items: [],
      allComplete: false,
      filter: "ALL",
      dataSource: ds.cloneWithRows([])
    };

    this.handleAddItem = this.handleAddItem.bind(this);
    this.onToggleAllComplete = this.onToggleAllComplete.bind(this);
    this.setSource = this.setSource.bind(this);
    this.onComplete = this.onComplete.bind(this);
    this.onRemove = this.onRemove.bind(this);
    this.handleFilter = this.handleFilter.bind(this);
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

    this.setSource(newItems, filterItems(this.state.filter, newItems), { value: '' });
  }

  handleFilter(filter) {
    this.setSource(this.state.items, filterItems(filter, this.state.items), { filter });
  }

  onToggleAllComplete() {
    const complete = !this.state.allComplete;
    const newItems = this.state.items.map((item) => {
      return {
        ...item,
        complete
      }
    });

    this.setSource(newItems, filterItems(this.state.filter, newItems), { allComplete: complete });
  }

  setSource(items, itemsDataSource, otherState = {}) {
    this.setState({
      items,
      dataSource: this.state.dataSource.cloneWithRows(itemsDataSource),
      ...otherState
    });
  }

  onComplete(key, complete) {
    const newItems = this.state.items.map((item) => {
      if (item.key !== key) return item;
      return {
        ...item,
        complete
      }
    });

    this.setSource(newItems, filterItems(this.state.filter, newItems));
  }

  onRemove(key) {
    const newItems = this.state.items.filter(item => item.key !== key);
    this.setSource(newItems, filterItems(this.state.filter, newItems));
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
                  onRemove={() => this.onRemove(key)}
                  onComplete={(complete) => this.onComplete(key, complete)}
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
        <Footer
          onFilter={this.handleFilter}
          filter={this.state.filter}
        />
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