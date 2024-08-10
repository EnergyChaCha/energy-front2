import React, {useState} from 'react';
import {View, TextInput, Button, StyleSheet, Alert} from 'react-native';
import { signIn } from '../services/api'; // API 함수를 import 합니다
import {saveUserInfo, saveToken} from '../services/storage'; // 저장 함수들을 import 합니다

export default function LoginScreen({navigation}) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const result = await signIn(username, password);
      if (result) {
        // 로그인 성공
        console.log(result);
        await saveToken(result.accessToken);
        navigation.navigate('Home');
      } else {
        // 로그인 실패
        Alert.alert(
          '로그인 실패',
          '사용자 이름 또는 비밀번호가 올바르지 않습니다.',
        );
      }
    } catch (error) {
      console.error('로그인 중 오류 발생:', error);
      Alert.alert('오류', '로그인 중 문제가 발생했습니다. 다시 시도해 주세요.');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="사용자 이름"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="비밀번호"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="로그인" onPress={handleLogin} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
});
