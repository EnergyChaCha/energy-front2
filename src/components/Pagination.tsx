import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const pageNumbers = [];
  let startPage, endPage;

  if (totalPages <= 5) {
    startPage = 1;
    endPage = totalPages;
  } else {
    if (currentPage <= 3) {
      startPage = 1;
      endPage = 5;
    } else if (currentPage + 2 >= totalPages) {
      startPage = totalPages - 4;
      endPage = totalPages;
    } else {
      startPage = currentPage - 2;
      endPage = currentPage + 2;
    }
  }

  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  return (
    <View style={styles.container}>
      {currentPage > 1 && (
        <>
          <TouchableOpacity onPress={() => onPageChange(1)}>
            <Text style={styles.pageItem}>{'<<'}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onPageChange(currentPage - 1)}>
            <Text style={styles.pageItem}>{'<'}</Text>
          </TouchableOpacity>
        </>
      )}

      {pageNumbers.map(number => (
        <TouchableOpacity
          key={number}
          onPress={() => onPageChange(number)}
          style={[
            styles.pageItem,
            currentPage === number && styles.currentPage,
          ]}>
          <Text
            style={
              currentPage === number
                ? styles.currentPageText
                : styles.pageItemText
            }>
            {number}
          </Text>
        </TouchableOpacity>
      ))}

      {currentPage < totalPages && (
        <>
          <TouchableOpacity onPress={() => onPageChange(currentPage + 1)}>
            <Text style={styles.pageItem}>{'>'}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onPageChange(totalPages)}>
            <Text style={styles.pageItem}>{'>>'}</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  pageItem: {
    padding: 10,
    marginHorizontal: 5,
  },
  currentPage: {
    backgroundColor: 'black',
    borderRadius: 50,
  },
  pageItemText: {
    color: 'black',
  },
  currentPageText: {
    color: 'white',
  },
});

export default Pagination;
