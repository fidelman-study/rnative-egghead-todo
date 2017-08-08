import React, { Component } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import Header from './header';
import Footer from './footer';

class App extends Component {
  constructor() {
    super();

    this.state = {
      value: '',
      items: [],
      allComplete: false
    };

    this.handleAddItem = this.handleAddItem.bind(this);
    this.onToggleAllComplete = this.onToggleAllComplete.bind(this);
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

    this.setState({
      items: newItems,
      value: ''
    });
  }

  onToggleAllComplete() {
    const complete = !this.state.allComplete;
    const newItems = this.state.items.map((item) => {
      return {
        ...item,
        complete
      }
    });

    console.table(newItems);

    this.setState({
      items: newItems,
      allComplete: complete
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
  }
});

export default App;