import React, { useEffect, useState } from 'react';
import Navbar from './shared/Navbar';
import FilterCard from './FilterCard';
import Job from './Job';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import axios from 'axios';
import { setSavedJobs } from '@/redux/jobSlice';

const Jobs = () => {
  const dispatch = useDispatch();
  const { allJobs, searchedQuery, savedJobs } = useSelector(store => store.job);
  const [filterJobs, setFilterJobs] = useState(allJobs);

  // ✅ Fetch saved jobs on page load
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

  // ✅ Handle filters
  useEffect(() => {
    if (!searchedQuery || searchedQuery === "") {
      setFilterJobs(allJobs);
      return;
    }

    if (typeof searchedQuery === 'object' && searchedQuery.type === "salary") {
      let min = 0, max = Infinity;
      const val = searchedQuery.value;

      if (val === "0-40k") {
        max = 400000;
      } else if (val === "42-1lakh") {
        min = 420000; max = 1000000;
      } else if (val === "1lakh to 5lakh") {
        min = 1000000; max = 5000000;
      }

      const filtered = allJobs.filter((job) => {
        const jobSalary = Number(job.salary);
        return !isNaN(jobSalary) && jobSalary >= min && jobSalary <= max;
      });

      setFilterJobs(filtered);
    } else if (typeof searchedQuery === 'object' && searchedQuery.type === "text") {
      const query = searchedQuery.value.toLowerCase();

      const filtered = allJobs.filter((job) =>
        job.title?.toLowerCase().includes(query) ||
        job.description?.toLowerCase().includes(query) ||
        job.location?.toLowerCase().includes(query) ||
        job.industry?.toLowerCase().includes(query) ||
        job.company?.name?.toLowerCase().includes(query)
      );

      setFilterJobs(filtered);
    }
  }, [allJobs, searchedQuery]);

  // ✅ Sort jobs to show saved jobs first
  const savedJobIds = savedJobs || [];
  const sortedJobs = [...filterJobs].sort((a, b) => {
    const aSaved = savedJobIds.includes(a._id);
    const bSaved = savedJobIds.includes(b._id);

    if (aSaved === bSaved) return 0;
    return aSaved ? -1 : 1; // saved jobs first
  });

  return (
    <div>
      <Navbar />
      <div className='max-w-7xl mx-auto mt-5'>
        <div className='flex gap-5'>
          <div className='w-[20%]'>
            <FilterCard />
          </div>

          {sortedJobs.length <= 0 ? (
            <div className='text-center text-gray-500 w-full mt-10'>No jobs found.</div>
          ) : (
            <div className='flex-1 h-[88vh] overflow-y-auto pb-5'>
              <div className='grid grid-cols-3 gap-4'>
                {sortedJobs.map((job) => (
                  <motion.div
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.3 }}
                    key={job?._id}
                  >
                    <Job job={job} />
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Jobs;
