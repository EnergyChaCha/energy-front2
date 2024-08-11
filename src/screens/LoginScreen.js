import React, {useState} from 'react';
import {
  View,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  Image,
  TouchableOpacity,
  Text,
} from 'react-native';
import {signIn} from '../services/api';
import {saveUserInfo, saveToken} from '../services/storage';

export default function LoginScreen({navigation}) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const result = await signIn(username, password);
      if (result) {
        await saveToken(result.accessToken);
        navigation.navigate('Home');
      } else {
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
      <View style={styles.logoContainer}>
        <View style={styles.logoIconContainer}>
          <Image
            source={require('../assets/ganhannalLogoIcon.png')}
            style={styles.logoIcon}
          />
        </View>
        <Image
          source={require('../assets/ganhannalLogoText.png')}
          style={styles.logo}
        />
      </View>

      <TextInput
        style={styles.input}
        placeholder="사용자 이름"
        value={username}
        onChangeText={setUsername}
        placeholderTextColor="#888"
      />
      <TextInput
        style={styles.input}
        placeholder="비밀번호"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholderTextColor="#888"
      />
      <Text style={styles.hintText}>id : ganhannal99    pw: qwe123!!</Text>
      <Text style={styles.hintText}>위 아이디로 테스트 해주시면 됩니다!</Text>
      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginButtonText}>로그인</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#eee',
  },
  logoContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    marginBottom: 100,
  },
  logoIconContainer: {
    width: 70,
    height: 70,
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
    marginRight: 10,
  },
  logoIcon: {
    width: '100%',
    height: '100%',
  },
  logo: {
    width: 180,
    height: 70,
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 15,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: 'white',
  },
  loginButton: {
    width: '50%',
    height: 50,
    backgroundColor: '#4374D9',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginTop: 10,
  },
  loginButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
