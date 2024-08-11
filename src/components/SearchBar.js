import React, {useState} from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';

const SearchBar = ({onSearch}) => {
  const [searchName, setSearchName] = useState('');

  const handleSearch = () => {
    if (searchName.trim().length < 2) {
      Alert.alert('검색 오류', '최소 2글자 이상 입력해주세요.');
      return;
    }
    onSearch(searchName);
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="근무자 이름으로 검색"
        value={searchName}
        onChangeText={setSearchName}
        onSubmitEditing={handleSearch}
        returnKeyType="search"
      />
      <TouchableOpacity onPress={handleSearch} style={styles.searchButton}>
        <Icon name="search" size={20} color="#4374D9" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: '#DDD',
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
    backgroundColor: '#FFF',
  },
  searchButton: {
    padding: 10,
  },
});

export default SearchBar;
