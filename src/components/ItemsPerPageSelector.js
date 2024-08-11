import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Picker} from '@react-native-picker/picker';

const ItemsPerPageSelector = ({itemsPerPage, onItemsPerPageChange}) => {
  return (
    <View style={styles.container}>
      <Picker
        selectedValue={itemsPerPage.toString()}
        onValueChange={itemValue => onItemsPerPageChange(parseInt(itemValue))}
        style={styles.picker}>
        <Picker.Item label="10" value="10" />
        <Picker.Item label="20" value="20" />
        <Picker.Item label="50" value="50" />
      </Picker>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-end',
    marginBottom: 10,
  },
  picker: {
    width: 100,
    backgroundColor: '#FFF',
    borderRadius: 5,
  },
});

export default ItemsPerPageSelector;
