import { useState, useEffect } from 'react';
import { AxiosResponse } from 'axios';

const useRequest = (axiosRequest: (x) => Promise<AxiosResponse>, payload?) => {
  const [data, setData] = useState();
  const [error, setError] = useState();
  useEffect(() => {(
    async function(){
      try {
        const { data } = await axiosRequest(payload) 
        setData(data.result);
      } catch (error) {
        setError(error)
      }
    }()
  )},[]);

  return [data,error]
};

export default useRequest;
