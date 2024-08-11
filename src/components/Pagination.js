import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';

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
        onPress={() => onPageChange(0)}
        disabled={currentPage === 0}>
        <Text
          style={[
            styles.paginationText,
            currentPage === 0 && styles.disabledText,
          ]}>
          &lt;&lt;
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => onPageChange(Math.max(0, currentPage - 1))}
        disabled={currentPage === 0}>
        <Text
          style={[
            styles.paginationText,
            currentPage === 0 && styles.disabledText,
          ]}>
          &lt;
        </Text>
      </TouchableOpacity>
      {pageNumbers.map(number => (
        <TouchableOpacity key={number} onPress={() => onPageChange(number - 1)}>
          <Text
            style={[
              styles.paginationText,
              currentPage === number - 1 && styles.activePage,
            ]}>
            {number}
          </Text>
        </TouchableOpacity>
      ))}
      <TouchableOpacity
        onPress={() => onPageChange(Math.min(totalPages - 1, currentPage + 1))}
        disabled={currentPage === totalPages - 1}>
        <Text
          style={[
            styles.paginationText,
            currentPage === totalPages - 1 && styles.disabledText,
          ]}>
          &gt;
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => onPageChange(totalPages - 1)}
        disabled={currentPage === totalPages - 1}>
        <Text
          style={[
            styles.paginationText,
            currentPage === totalPages - 1 && styles.disabledText,
          ]}>
          &gt;&gt;
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  paginationText: {
    fontSize: 16,
    color: '#4374D9',
    marginHorizontal: 5,
    padding: 5,
  },
  disabledText: {
    color: '#CCC',
  },
  activePage: {
    fontWeight: 'bold',
    backgroundColor: '#4374D9',
    color: 'white',
    borderRadius: 5,
  },
});

export default Pagination;
