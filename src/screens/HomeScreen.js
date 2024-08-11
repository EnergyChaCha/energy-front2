import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Alert, Text} from 'react-native';
import {getStaffList} from '../services/api';
import SearchBar from '../components/SearchBar';
import FilterSort from '../components/FilterSort';
import StaffList from '../components/StaffList';
import Pagination from '../components/Pagination';
import ItemsPerPageSelector from '../components/ItemsPerPageSelector';

const HomeScreen = () => {
  const [searchName, setSearchName] = useState('');
  const [sortOptions, setSortOptions] = useState([]);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [staffData, setStaffData] = useState([]);
  const [filterBy, setFilterBy] = useState('');

  const fetchData = async () => {
    try {
      const orderParam =
        sortOptions.length > 0
          ? sortOptions
              .map(option => `${option.field}-${option.direction}`)
              .join(',')
          : null;

      const result = await getStaffList(
        currentPage,
        itemsPerPage,
        searchName || null,
        orderParam,
        filterBy || null,
      );

      if (result) {
        setStaffData(result.content);
        setTotalPages(result.totalPages);
        setTotalElements(result.totalElements);
      }
    } catch (error) {
      console.log('데이터를 가져오는데 실패했습니다.', error);
      Alert.alert('오류', '데이터를 가져오는데 실패했습니다.');
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentPage, itemsPerPage, searchName, sortOptions, filterBy]);

  const handleSearch = searchTerm => {
    setSearchName(searchTerm);
    setCurrentPage(0);
  };

  const handleSortFilterChange = newSortOptions => {
    setSortOptions(newSortOptions);
    setCurrentPage(0);
  };

  const handleFilterChange = newFilter => {
    setFilterBy(newFilter);
    setCurrentPage(0);

    console.log(newFilter);
  };

  const handlePageChange = newPage => {
    setCurrentPage(newPage);
  };

  const handleItemsPerPageChange = newItemsPerPage => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(0);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>STAFF LIST</Text>
      <SearchBar onSearch={handleSearch} />
      <FilterSort
        initialSortOptions={sortOptions}
        onSortFilterChange={handleSortFilterChange}
        onFilterChange={handleFilterChange}
      />
      <ItemsPerPageSelector
        itemsPerPage={itemsPerPage}
        onItemsPerPageChange={handleItemsPerPageChange}
      />
      <StaffList data={staffData} />
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
    backgroundColor: '#F5F5F5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
});

export default HomeScreen;
