import api from './axiosConfig';

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

export const getStaffList = async (
  page: number,
  size: number,
  name: string | null,
  order: string | null,
  filter: string | null,
) => {
  try {
    const params: {[key: string]: any} = {page, size};
    if (name) params.name = name;
    if (order) params.order = order;
    if(filter) {
      if (filter == "step") params.step = 7000;
      if (filter == 'bpm') params.bpm = 120;
      if (filter == 'distance') params.distance = 6;
    }
    const response = await api.get('/cj/searchName', {params});
    return response.data.result;    
  } catch (error) {
    console.log(error);
  }
};