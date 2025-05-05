import React from 'react';
import { Button } from './ui/button';
import { Bookmark, BookmarkCheck } from 'lucide-react';
import { Avatar, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addSavedJob, removeSavedJob } from '@/redux/jobSlice';
import axios from 'axios';

const Job = ({ job }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const savedJobIds = useSelector((state) => state.job.savedJobs) || [];
  const isSaved = savedJobIds.includes(job._id);

  const daysAgoFunction = (mongodbTime) => {
    const createdAt = new Date(mongodbTime);
    const currentTime = new Date();
    const timeDifference = currentTime - createdAt;
    return Math.floor(timeDifference / (1000 * 60 * 60 * 24));
  };

  const formatDeadline = (deadline) => {
    if (!deadline) return "NA";
    const deadlineDate = new Date(deadline);
    return deadlineDate.toLocaleDateString("en-GB");
  };

  const isExpired = job?.deadline && new Date(job.deadline) < new Date();

  const getFormattedSalary = (salary) => {
    if (!salary || isNaN(salary)) return "NA";
    return `${(salary / 100000).toFixed(1)} LPA`;
  };

  const handleSaveJob = async () => {
    try {
      await axios.post(
        `http://localhost:8000/api/v1/savedJobs/save/${job._id}`,
        {},
        { withCredentials: true }
      );
      dispatch(addSavedJob(job._id));
    } catch (err) {
      if (err.response?.status === 400) {
        dispatch(addSavedJob(job._id)); // already saved
      } else {
        console.error("Error saving job:", err);
      }
    }
  };

  const handleUnsaveJob = async () => {
    try {
      await axios.delete(
        `http://localhost:8000/api/v1/savedJobs/unsave/${job._id}`,
        { withCredentials: true }
      );
      dispatch(removeSavedJob(job._id));
    } catch (err) {
      console.error("Error unsaving job:", err);
    }
  };

  return (
    <div
      className={`relative flex flex-col justify-between h-full p-5 rounded-xl shadow-md bg-white border transition hover:shadow-lg ${isExpired ? 'border-red-500 bg-red-50' : 'border-gray-100'
        }`}
    >
      {/* Expired Badge */}
      {isExpired && (
        <div className="absolute top-2 left-20 z-10">
          <Badge className="bg-red-600 text-white">Expired</Badge>
        </div>
      )}


      {/* Top Row: Created At & Save */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          {daysAgoFunction(job?.createdAt) === 0
            ? "Today"
            : `${daysAgoFunction(job?.createdAt)} day(s) ago`}
        </p>
        <Button
          variant="outline"
          className="rounded-full"
          size="icon"
          onClick={isSaved ? handleUnsaveJob : handleSaveJob}
        >
          {isSaved ? (
            <BookmarkCheck size={16} className="text-green-500" />
          ) : (
            <Bookmark size={16} />
          )}
        </Button>
      </div>

      {/* Company Info */}
      <div className="flex items-center gap-3 my-3">
        <Avatar className="h-12 w-12">
          <AvatarImage src={job?.company?.logo} />
        </Avatar>
        <div>
          <h2 className="font-semibold">{job?.company?.name}</h2>
          <p className="text-sm text-gray-500">{job?.location || 'India'}</p>
        </div>
      </div>

      {/* Title, Deadline, Description */}
      <div>
        <h1 className="font-bold text-xl mb-2">{job?.title}</h1>
        <p
          className={`text-sm font-semibold mb-1 ${isExpired ? 'text-red-600' : 'text-green-600'
            }`}
        >
          Deadline: {formatDeadline(job?.deadline)}
        </p>
        <p className="text-sm text-gray-600">{job?.description}</p>
      </div>

      {/* Job Info */}
      <div className="flex flex-wrap items-center gap-2 mt-4">
        <Badge variant="secondary">{job?.position} Position(s)</Badge>
        <Badge variant="outline">{job?.jobType}</Badge>
        <Badge className="bg-purple-100 text-purple-700 font-semibold">
          {getFormattedSalary(job?.salary)}
        </Badge>
      </div>

      {/* Buttons */}
      <div className="flex items-center gap-4 mt-6">
        <Button
          onClick={() => navigate(`/description/${job?._id}`)}
          variant="outline"
        >
          Details
        </Button>
        <Button className="bg-[#7209b7] text-white" disabled={isExpired}>
          {isExpired ? 'Closed' : 'Apply Now'}
        </Button>
      </div>
    </div>
  );
};

export default Job;
