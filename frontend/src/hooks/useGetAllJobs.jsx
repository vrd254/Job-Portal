import { setAllJobs } from '@/redux/jobSlice';
import { JOB_API_END_POINT } from '@/utils/constant';
import axios from 'axios';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

const useGetAllJobs = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchAllJobs = async () => {
      try {
        const res = await axios.get(`${JOB_API_END_POINT}/get`, {
          withCredentials: true
        });

        if (res.data.success) {
          dispatch(setAllJobs(res.data.jobs));
        }
      } catch (error) {
        if (error.response?.status === 401) {
          console.warn("Unauthorized. Please login.");
          // optionally: redirect to login
        } else {
          console.error("Failed to fetch jobs:", error);
        }
      }
    };

    fetchAllJobs();
  }, [dispatch]);
};

export default useGetAllJobs;
