import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { setAllAdminJobs } from '@/redux/jobSlice';
import { JOB_API_END_POINT } from '@/utils/constant';

const useGetAllAdminJobs = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchAllAdminJobs = async () => {
            try {
                const response = await axios.get(`${JOB_API_END_POINT}/getadminjobs`, {
                    withCredentials: true
                });

                if (response.data.success) {
                    dispatch(setAllAdminJobs(response.data.jobs));
                } else {
                    console.error('Failed to fetch admin jobs:', response.data.message);
                }
            } catch (error) {
                console.error('Error fetching admin jobs:', error);
            }
        };

        fetchAllAdminJobs();
    }, [dispatch]);
};

export default useGetAllAdminJobs;
