import React, {useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {Picker} from '@react-native-picker/picker';

const FilterSort = ({
  initialSortOptions,
  onSortFilterChange,
  onFilterChange,
}) => {
  const [showSortFilter, setShowSortFilter] = useState(false);
  const [filterBy, setFilterBy] = useState('');
  const [sortOptions, setSortOptions] = useState([...initialSortOptions]);

  const toggleSortOption = option => {
    let newSortOptions = [...sortOptions];
    const existingOptionIndex = newSortOptions.findIndex(
      item => item.field === option,
    );

    if (existingOptionIndex > -1) {
      const existingOption = newSortOptions[existingOptionIndex];
      if (existingOption.direction === 'asc') {
        newSortOptions[existingOptionIndex] = {
          ...existingOption,
          direction: 'desc',
        };
      } else {
        newSortOptions.splice(existingOptionIndex, 1);
      }
    } else {
      newSortOptions.push({
        field: option,
        direction: 'asc',
        order: newSortOptions.length + 1,
      });
    }
    
    newSortOptions = newSortOptions.map((item, index) => ({
      ...item,
      order: index + 1,
    }));

    setSortOptions(newSortOptions);
  };

  const getSortIcon = option => {
    const sortOption = sortOptions.find(item => item.field === option);
    if (!sortOption) {
      return {name: 'sort', color: 'gray'};
    }
    return sortOption.direction === 'asc'
      ? {name: 'sort-amount-up-alt', color: '#4374D9'}
      : {name: 'sort-amount-down', color: '#4374D9'};
  };

  const applyFilters = () => {
    onSortFilterChange(sortOptions);
    onFilterChange(filterBy);
    setShowSortFilter(false);
  };

  const resetFilters = () => {
    setFilterBy('');
    setSortOptions([]);
    onSortFilterChange([]);
    onFilterChange('');
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.filterButton,
          showSortFilter && styles.activeFilterButton,
        ]}
        onPress={() => setShowSortFilter(!showSortFilter)}>
        <Text style={[styles.buttonText, !showSortFilter && {color: 'white'}]}>
          필터 및 정렬
        </Text>
      </TouchableOpacity>

      {showSortFilter && (
        <View style={styles.sortFilterForm}>
          <Text style={styles.sortTitle}>정렬 조건</Text>
          <View style={styles.sortButtons}>
            {['step', 'distance', 'bpm'].map(option => {
              const sortOption = sortOptions.find(
                item => item.field === option,
              );
              return (
                <TouchableOpacity
                  key={option}
                  style={[styles.sortButton]}
                  onPress={() => toggleSortOption(option)}>
                  <Text style={styles.buttonText}>
                    {option === 'step'
                      ? '걸음수'
                      : option === 'distance'
                      ? '이동거리'
                      : '심박수'}
                  </Text>
                  <Text style={styles.orderNumber}>
                    {sortOption ? `${sortOption.order}` : ''}
                  </Text>
                  <Icon
                    style={styles.icon}
                    name={getSortIcon(option).name}
                    size={20}
                    color={getSortIcon(option).color}
                  />
                </TouchableOpacity>
              );
            })}
          </View>

          <Text style={styles.sortTitle}>필터 조건</Text>
          <View style={styles.filterActions}>
            <View style={styles.picker}>
              <Picker
                selectedValue={filterBy}
                onValueChange={itemValue => setFilterBy(itemValue)}>
                <Picker.Item label="필터" value="" />
                <Picker.Item label="심박수 주의" value="bpm" />
                <Picker.Item label="걸음수 주의" value="step" />
                <Picker.Item label="이동거리 주의" value="distance" />
              </Picker>
            </View>
            {(filterBy !== '' || sortOptions.length > 0) && (
              <View style={styles.filterControlButton}>
                <TouchableOpacity
                  style={styles.applyButton}
                  onPress={applyFilters}>
                  <Text style={styles.filterButtonText}>필터 및 정렬 적용</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.resetButton}
                  onPress={resetFilters}>
                  <Text style={styles.filterButtonText}>초기화</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
  },
  filterButton: {
    backgroundColor: '#4374D9',
    padding: 10,
    alignItems: 'center',
    borderRadius: 5,
  },
  activeFilterButton: {
    backgroundColor: '#B2CCFF',
  },
  buttonText: {
    fontWeight: 'bold',
  },
  sortFilterForm: {
    marginTop: 10,
    backgroundColor: '#FFF',
    padding: 10,
    borderRadius: 5,
  },
  sortTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  sortButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  sortButton: {
    width: '30%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
    padding: 10,
    borderRadius: 5,
    justifyContent: 'center',
  },
  icon: {
    marginLeft: 3,
  },
  orderNumber: {
    color: '#4374D9',
    marginLeft: 10,
    fontWeight: 'bold',
  },
  filterActions: {
    flexDirection: 'column',
  },
  picker: {
    backgroundColor: '#F0F0F0',
    borderRadius: 5,
    marginBottom: 10,
  },
  filterControlButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  applyButton: {
    backgroundColor: '#4374D9',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginRight: 5,
    alignItems: 'center',
  },
  resetButton: {
    backgroundColor: '#FF6B6B',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginLeft: 5,
    alignItems: 'center',
  },
  filterButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
});

export default FilterSort;
