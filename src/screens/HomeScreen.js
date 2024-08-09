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
    setSortBy('');
    setFilterBy('');
    setSearchQuery('');
    setFilteredData(dummyData);
  };

  const handlePageChange = page => {
    setCurrentPage(page);
    // 여기에 페이지 변경 시 데이터를 새로 불러오는 로직을 추가할 수 있습니다.
  };

  const handleSearch = () => {
    const trimmedQuery = searchQuery.trim();

    if (trimmedQuery.length < 2) {
      Alert.alert('검색 오류', '최소 2글자 이상 입력해주세요.');
      return;
    }

    // 검색 처리 로직
    console.log('Searching for:', trimmedQuery);

    // 필터링된 데이터를 업데이트합니다.
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
      .sort((a, b) => b[1] - a[1]); // 정렬 우선순위를 위해 역순 정렬

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
        return {name: 'sort-amount-down', color: 'blue'};
      case 2:
        return {name: 'sort-amount-up-alt', color: 'blue'};
    }
  };


  const renderItem = ({item}) => (
    <View style={styles.listItem}>
      <Text>{item.name}</Text>
      <Text>Steps: {item.steps}</Text>
      <Text>Distance: {item.distance} km</Text>
      <Text>Heart Rate: {item.heartRate} bpm</Text>
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
          // 엔터키 입력 시 공백 제거 후 검색 수행
          setSearchQuery(prev => prev.trim());
          handleSearch();
        }}
        returnKeyType="search"
      />

      <TouchableOpacity
        style={styles.filterButton}
        onPress={() => setShowSortFilter(!showSortFilter)}>
        <Text>필터 및 정렬</Text>
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
    backgroundColor: 'black',
    padding: 10,
    borderRadius: 5,
    margin: 5,
  },
  resetButton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
    margin: 5,
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
  picker:{
    width:"50%",
    backgroundColor: 'white',
    borderRadius:5,
  }
});

export default HomeScreen;
