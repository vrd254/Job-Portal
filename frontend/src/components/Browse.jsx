import React, { useEffect } from 'react';
import Navbar from './shared/Navbar';
import Job from './Job';
import { useDispatch, useSelector } from 'react-redux';
import { setSavedJobs, setSearchedQuery } from '@/redux/jobSlice';
import useGetAllJobs from '@/hooks/useGetAllJobs';
import axios from 'axios';

const Browse = () => {
  useGetAllJobs();
  const dispatch = useDispatch();
  const { allJobs, savedJobs } = useSelector((store) => store.job);

  // ✅ Fetch saved jobs from backend and update Redux
  useEffect(() => {
    const fetchSavedJobs = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/v1/savedJobs", {
          withCredentials: true,
        });
        const savedIds = res.data.map(job => job._id);
        dispatch(setSavedJobs(savedIds));
      } catch (error) {
        console.error("Error fetching saved jobs:", error);
      }
    };

    fetchSavedJobs();
  }, [dispatch]);

  useEffect(() => {
    return () => {
      dispatch(setSearchedQuery(""));
    };
  }, [dispatch]);

  // ✅ Separate saved jobs and non-saved jobs
  const savedJobList = allJobs.filter(job => savedJobs.includes(job._id));
  const nonSavedJobList = allJobs.filter(job => !savedJobs.includes(job._id));

  return (
    <div>
      <Navbar />
      <div className="max-w-7xl mx-auto my-10 space-y-14">

        {/* 🔖 Saved Jobs Section */}
        {savedJobList.length > 0 && (
          <section>
            <h2 className="font-bold text-2xl mb-4">🔖 Your Saved Jobs ({savedJobList.length})</h2>
            <div className="grid grid-cols-3 gap-6">
              {savedJobList.map((job) => (
                <Job key={job._id} job={job} />
              ))}
            </div>
          </section>
        )}

        {/* 💼 All Jobs Section */}
        <section>
          <h2 className="font-bold text-2xl mb-4">💼 All Jobs ({nonSavedJobList.length})</h2>
          <div className="grid grid-cols-3 gap-6">
            {nonSavedJobList.map((job) => (
              <Job key={job._id} job={job} />
            ))}
          </div>
        </section>

      </div>
    </div>
  );
};

export default Browse;
