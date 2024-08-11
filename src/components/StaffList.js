import React from 'react';
import {View, Text, FlatList, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';

const StaffList = ({data}) => {
  const renderItem = ({item}) => (
    <View style={styles.listItem}>
      <View style={styles.nameColumn}>
        <Text style={styles.nameText}>{item.name}</Text>
      </View>
      <View style={styles.dataColumn}>
        <Text style={styles.dataTitle}>심박수</Text>
        <View style={styles.dataRow}>
          <Icon name="heartbeat" size={16} color="#FF6B6B" />
          <Text style={styles.dataText}>{item.bpm} bpm</Text>
        </View>
      </View>
      <View style={styles.dataColumn}>
        <Text style={styles.dataTitle}>걸음수</Text>
        <View style={styles.dataRow}>
          <Icon name="shoe-prints" size={16} color="#4DABF7" />
          <Text style={styles.dataText}>{item.step}</Text>
        </View>
      </View>
      <View style={styles.dataColumn}>
        <Text style={styles.dataTitle}>거리</Text>
        <View style={styles.dataRow}>
          <Icon name="route" size={16} color="#82C91E" />
          <Text style={styles.dataText}>{item.distance} km</Text>
        </View>
      </View>
    </View>
  );

  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={(item, index) => `${item.memberId}-${index}`}
    />
  );
};

const styles = StyleSheet.create({
  listItem: {
    flexDirection: 'row',
    padding: 15,
    backgroundColor: '#FFF',
    borderRadius: 5,
    marginBottom: 10,
    elevation: 2,
  },
  nameColumn: {
    flex: 1,
    marginRight: 10,
    justifyContent: 'center',
  },
  nameText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  dataColumn: {
    flex: 1,
    alignItems: 'center',
    width: '30%',
  },
  dataTitle: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  dataRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dataText: {
    fontSize: 14,
    marginLeft: 5,
    color: '#333',
  },
});

export default StaffList;
