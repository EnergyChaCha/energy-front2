import api from './axiosConfig';

interface SignInData {
  adminId: string;
  adminPw: string;
}

export const signIn = async (loginId: string, password: string) => {
  try {
    const response = await api.post('/auth/signin', {
      loginId: `${loginId}`,
      password: `${password}`,
    });
    return response.data.result;
  } catch (error) {
    console.log(error);
  }
};
