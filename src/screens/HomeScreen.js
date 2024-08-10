import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  Alert,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import Pagination from '../components/Pagination';
import Icon from "react-native-vector-icons/FontAwesome5";

const HomeScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOptions, setSortOptions] = useState({
    steps: 0, // 0: 미적용, 1: 오름차순, 2: 내림차순
    distance: 0,
    heartRate: 0,
  });

  const [showSortFilter, setShowSortFilter] = useState(false);
  const [sortBy, setSortBy] = useState('');
  const [filterBy, setFilterBy] = useState('');
  const [itemsPerPage, setItemsPerPage] = useState('10');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(10); // 예시로 10페이지로 설정

  // 더미 데이터
  const dummyData = Array.from({length: 50}, (_, i) => ({
    id: i + 1,
    name: `Staff ${i + 1}`,
    steps: Math.floor(Math.random() * 10000),
    distance: Math.floor(Math.random() * 100) / 10,
    heartRate: Math.floor(Math.random() * 50) + 60,
  }));

  const [filteredData, setFilteredData] = useState(dummyData);

  const resetFilters = () => {
    setSortOptions({steps: 0, distance: 0, heartRate: 0});
    setSortBy('');
    setFilterBy('');
    setSearchQuery('');
    setFilteredData(dummyData);
  };

  const handlePageChange = page => {
    setCurrentPage(page);

  };

  const handleSearch = () => {
    const trimmedQuery = searchQuery.trim();

    if (trimmedQuery.length < 2) {
      Alert.alert('검색 오류', '최소 2글자 이상 입력해주세요.');
      return;
    }

    const filtered = dummyData.filter(item =>
      item.name.toLowerCase().includes(trimmedQuery.toLowerCase()),
    );
    setFilteredData(filtered);
  };

  const toggleSortOption = option => {
    setSortOptions(prevOptions => ({
      ...prevOptions,
      [option]: (prevOptions[option] + 1) % 3,
    }));
  };

  const applyFilters = () => {
    let sortedData = [...filteredData];
    const sortOrder = Object.entries(sortOptions)
      .filter(([_, value]) => value !== 0)
      .sort((a, b) => b[1] - a[1]);

    sortedData.sort((a, b) => {
      for (let [key, order] of sortOrder) {
        if (a[key] < b[key]) return order === 1 ? -1 : 1;
        if (a[key] > b[key]) return order === 1 ? 1 : -1;
      }
      return 0;
    });

    setFilteredData(sortedData);
    setShowSortFilter(false);
  };

  const getSortIcon = option => {
    switch (sortOptions[option]) {
      case 0:
        return {name: 'sort-amount-down', color: 'gray'};
      case 1:
        return {name: 'sort-amount-down', color: '#4374D9'};
      case 2:
        return {name: 'sort-amount-up-alt', color: '#4374D9'};
    }
  };


  const renderItem = ({item}) => (
    <View style={styles.listItem}>
      <View style={styles.nameColumn}>
        <Text style={styles.nameText}>{item.name}</Text>
      </View>
      <View style={styles.dataColumn}>
        <Text style={styles.dataTitle}>심박수</Text>
        <View style={styles.dataRow}>
          <Icon name="heartbeat" size={16} color="#FF6B6B" />
          <Text style={styles.dataText}>{item.heartRate} bpm</Text>
        </View>
      </View>
      <View style={styles.dataColumn}>
        <Text style={styles.dataTitle}>걸음수</Text>
        <View style={styles.dataRow}>
          <Icon name="shoe-prints" size={16} color="#4DABF7" />
          <Text style={styles.dataText}>{item.steps}</Text>
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
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>STAFF LIST</Text>
        {/* <TouchableOpacity>
          <Icon name="settings-outline" size={24} color="black" />
        </TouchableOpacity> */}
      </View>

      <TextInput
        style={styles.searchBox}
        placeholder="근무자 이름으로 검색"
        value={searchQuery}
        onChangeText={setSearchQuery}
        onSubmitEditing={() => {
          setSearchQuery(prev => prev.trim());
          handleSearch();
        }}
        returnKeyType="search"
      />

      <TouchableOpacity
        style={[
          styles.filterButton,
          showSortFilter && {backgroundColor: '#B2CCFF'},
        ]}
        onPress={() => setShowSortFilter(!showSortFilter)}>
        <Text style={styles.buttonText}>필터 및 정렬</Text>
      </TouchableOpacity>

      {showSortFilter && (
        <View style={styles.sortFilterForm}>
          <Text style={styles.sortTitle}>정렬 조건</Text>
          <View style={styles.sortButtons}>
            {['steps', 'distance', 'heartRate'].map(option => (
              <TouchableOpacity
                key={option}
                style={[styles.sortButton, sortOptions[option] !== 0]}
                onPress={() => toggleSortOption(option)}>
                <Text style={styles.buttonText}>
                  {option === 'steps'
                    ? '걸음수'
                    : option === 'distance'
                    ? '이동거리'
                    : '심박수'}
                </Text>
                <Icon
                  name={getSortIcon(option).name}
                  size={20}
                  color={getSortIcon(option).color}
                />
              </TouchableOpacity>
            ))}
          </View>
          <Text style={styles.sortTitle}>필터 조건</Text>
          <View style={styles.filterActions}>
            <View style={styles.picker}>
              <Picker
                selectedValue={filterBy}
                onValueChange={itemValue => setFilterBy(itemValue)}>
                <Picker.Item label="필터" value="" />
                <Picker.Item label="심박수 주의" value="heartRate" />
                <Picker.Item label="걸음수 주의" value="steps" />
                <Picker.Item label="이동거리 주의" value="distance" />
              </Picker>
            </View>
            {(filterBy !== '' ||
              Object.values(sortOptions).some(value => value !== 0)) && (
              <View style={styles.filterActions}>
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

      <View style={styles.itemsPerPageContainer}>
        <Picker
          selectedValue={itemsPerPage}
          onValueChange={itemValue => setItemsPerPage(itemValue)}
          style={styles.itemsPerPagePicker}>
          <Picker.Item label="10" value="10" />
          <Picker.Item label="20" value="20" />
          <Picker.Item label="50" value="50" />
        </Picker>
      </View>

      <FlatList
        data={filteredData.slice(
          (currentPage - 1) * parseInt(itemsPerPage),
          currentPage * parseInt(itemsPerPage),
        )}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
      />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    color: 'black',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  searchBox: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingLeft: 10,
    marginBottom: 10,
  },
  filterButton: {
    backgroundColor: '#ddd',
    padding: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  sortFilterForm: {
    marginBottom: 10,
  },
  filterActions: {
    flexDirection: 'row',
  },
  applyButton: {
    backgroundColor: '#5D5D5D',
    padding: 10,
    borderRadius: 5,
    margin: 5,
    justifyContent: 'center',
  },
  resetButton: {
    backgroundColor: '#F15F5F',
    padding: 10,
    borderRadius: 5,
    margin: 5,
    marginLeft: 0,
    justifyContent: 'center',
  },
  filterButtonText: {
    color: 'white',
  },
  itemsPerPageContainer: {
    alignItems: 'flex-end',
    marginBottom: 10,
  },
  itemsPerPagePicker: {
    width: 100,
  },
  listItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
  },
  sortTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  sortButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    padding: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginRight: 10,
    backgroundColor: 'white',
  },
  buttonText: {
    color: 'black',
    marginRight: 10,
  },
  picker: {
    width: '50%',
    backgroundColor: 'white',
    borderRadius: 5,
  },
  listItem: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    alignItems: 'center',
  },
  nameColumn: {
    flex: 2,
    marginRight: 10,
  },
  nameText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  dataColumn: {
    flex: 1,
    alignItems: 'center',
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
    marginLeft: 4,
  },
});

export default HomeScreen;
