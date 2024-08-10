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
import Icon from 'react-native-vector-icons/FontAwesome5';

const HomeScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOptions, setSortOptions] = useState({
    steps: 0,
    distance: 0,
    heartRate: 0,
  });
  const [showSortFilter, setShowSortFilter] = useState(false);
  const [filterBy, setFilterBy] = useState('');
  const [filterValue, setFilterValue] = useState('');
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  // 더미 데이터 생성
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
    setFilterBy('');
    setFilterValue('');
    setSearchQuery('');
    setFilteredData(dummyData);
    setCurrentPage(1);
  };

  const handleSearch = () => {
    if (searchQuery.trim().length < 2) {
      Alert.alert('검색 오류', '최소 2글자 이상 입력해주세요.');
      return;
    }
    applyFilters();
  };

  const toggleSortOption = option => {
    setSortOptions(prevOptions => ({
      ...prevOptions,
      [option]: (prevOptions[option] + 1) % 3,
    }));
  };

  const applyFilters = () => {
    // API 호출 시뮬레이션
    console.log('Calling API with filters:', {
      searchQuery,
      sortOptions,
      filterBy,
      filterValue,
    });

    // 실제 API 호출 대신 setTimeout으로 비동기 처리 시뮬레이션
    setTimeout(() => {
      let result = [...dummyData];

      // 검색 필터 적용
      if (searchQuery.trim().length >= 2) {
        result = result.filter(item =>
          item.name.toLowerCase().includes(searchQuery.toLowerCase()),
        );
      }

      // 정렬 적용
      const sortOrder = Object.entries(sortOptions)
        .filter(([_, value]) => value !== 0)
        .sort((a, b) => b[1] - a[1]);

      result.sort((a, b) => {
        for (let [key, order] of sortOrder) {
          if (a[key] < b[key]) return order === 1 ? -1 : 1;
          if (a[key] > b[key]) return order === 1 ? 1 : -1;
        }
        return 0;
      });

      // 필터 적용
      if (filterBy && filterValue) {
        result = result.filter(item => {
          switch (filterBy) {
            case 'heartRate':
              return item.heartRate > parseInt(filterValue);
            case 'steps':
              return item.steps < parseInt(filterValue);
            case 'distance':
              return item.distance > parseFloat(filterValue);
            default:
              return true;
          }
        });
      }

      setFilteredData(result);
      setCurrentPage(1);
      setShowSortFilter(false);
    }, 500); // 500ms 딜레이로 API 호출 시뮬레이션
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

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const Pagination = ({currentPage, totalPages, onPageChange}) => {
    const pageNumbers = [];
    const maxPagesToShow = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return (
      <View style={styles.pagination}>
        <TouchableOpacity
          onPress={() => onPageChange(1)}
          disabled={currentPage === 1}>
          <Text
            style={[
              styles.paginationText,
              currentPage === 1 && styles.disabledText,
            ]}>
            &lt;&lt;
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}>
          <Text
            style={[
              styles.paginationText,
              currentPage === 1 && styles.disabledText,
            ]}>
            &lt;
          </Text>
        </TouchableOpacity>
        {pageNumbers.map(number => (
          <TouchableOpacity key={number} onPress={() => onPageChange(number)}>
            <Text
              style={[
                styles.paginationText,
                currentPage === number && styles.activePage,
              ]}>
              {number}
            </Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity
          onPress={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}>
          <Text
            style={[
              styles.paginationText,
              currentPage === totalPages && styles.disabledText,
            ]}>
            &gt;
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}>
          <Text
            style={[
              styles.paginationText,
              currentPage === totalPages && styles.disabledText,
            ]}>
            &gt;&gt;
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  const isFilterActive =
    Object.values(sortOptions).some(v => v !== 0) ||
    filterBy !== '' ||
    filterValue !== '';

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>STAFF LIST</Text>
      </View>

      <TextInput
        style={styles.searchBox}
        placeholder="근무자 이름으로 검색"
        value={searchQuery}
        onChangeText={setSearchQuery}
        onSubmitEditing={handleSearch}
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

      <View style={styles.itemsPerPageContainer}>
        <Picker
          selectedValue={itemsPerPage.toString()}
          onValueChange={itemValue => setItemsPerPage(parseInt(itemValue))}
          style={styles.itemsPerPagePicker}>
          <Picker.Item label="10" value="10" />
          <Picker.Item label="20" value="20" />
          <Picker.Item label="50" value="50" />
        </Picker>
      </View>

      <FlatList
        data={currentItems}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
      />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F5F5F5',
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
    color: '#333',
  },
  searchBox: {
    height: 40,
    borderColor: '#DDD',
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
    marginBottom: 10,
    backgroundColor: '#FFF',
  },
  filterButton: {
    backgroundColor: '#4374D9',
    padding: 10,
    alignItems: 'center',
    marginBottom: 10,
    borderRadius: 5,
  },
  buttonText: {
    fontWeight: 'bold',
    marginRight:5
  },
  sortFilterForm: {
    marginBottom: 10,
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
    marginBottom: 10,
    color: 'black',
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
    padding: 10,
    borderRadius: 5,
    paddingHorizontal: 20,
  },
  activeSortButton: {
    backgroundColor: '#B2CCFF',
  },
  filterActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  filterControlButton:{
    width:"100%",
    marginLeft:20
  },
  picker: {
    width: '50%',
    height: 55,
    backgroundColor: '#F0F0F0',
    borderRadius: 5,
    padding: 1,
  },
  resetButton: {
    width: '40%',
    backgroundColor: '#F15F5F',
    padding: 10,
    borderRadius: 5,
    margin: 5,
    alignItems: 'center',
  },
  applyButton: {
    width: '40%',
    backgroundColor: '#5D5D5D',
    padding: 10,
    borderRadius: 5,
    margin: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  itemsPerPageContainer: {
    alignItems: 'flex-end',
    marginBottom: 10,
  },
  itemsPerPagePicker: {
    width: 100,
    backgroundColor: '#FFF',
    borderRadius: 5,
  },
  listItem: {
    flexDirection: 'row',
    padding: 15,
    backgroundColor: '#FFF',
    borderRadius: 5,
    marginBottom: 10,
    elevation: 2,
  },
  nameColumn: {
    flex: 2,
    marginRight: 10,
  },
  nameText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
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
    color: '#333',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
  },
  paginationText: {
    fontSize: 16,
    color: '#4374D9',
    fontWeight: 'bold',
  },
  disabledText: {
    color: '#CCC',
  },
});

export default HomeScreen;
