import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "../ui/select";

const EditJob = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [jobData, setJobData] = useState({});
  const [loading, setLoading] = useState(false);

  const industryList = [
    'Frontend Developer',
    'Backend Developer',
    'FullStack Developer',
    'Cloud Engineer',
    'DevOps Engineer',
    'Machine Learning Engineer',
    'AI/ML Engineer',
    'Data Scientist',
    'Cybersecurity Engineer',
    'Blockchain Developer',
    'Game Developer',
    'Mobile Developer',
    'Product Manager',
    'UI/UX Designer',
    'QA Tester',
    'Others'
  ];

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/api/v1/job/get/${id}`, {
          withCredentials: true
        });
        const job = res.data?.job;
        if (job) {
          setJobData({
            title: job.title || '',
            description: job.description || '',
            requirements: job.requirements ? job.requirements.join(', ') : '',
            salary: job.salary || '',
            location: job.location || '',
            jobType: job.jobType || '',
            experience: job.experienceLevel || '',
            position: job.position || '',
            deadline: job.deadline ? new Date(job.deadline).toISOString().split('T')[0] : '',
            industry: job.industry || ''
          });
        }
      } catch (error) {
        console.error('Error fetching job details:', error);
        alert('Failed to load job details');
      }
    };

    fetchJob();
  }, [id]);

  const handleChange = (e) => {
    setJobData({ ...jobData, [e.target.name]: e.target.value });
  };

  const handleIndustryChange = (value) => {
    setJobData({ ...jobData, industry: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const updatedData = {};
    Object.keys(jobData).forEach((key) => {
      if (jobData[key] !== '') {
        updatedData[key] = jobData[key];
      }
    });

    try {
      await axios.put(`http://localhost:8000/api/v1/job/update-job/${id}`, updatedData, {
        withCredentials: true,
      });
      alert('Job updated successfully!');
      navigate('/admin/jobs');
    } catch (error) {
      console.error('Error updating job:', error);
      alert('Failed to update job.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 bg-white p-6 md:p-8 rounded-xl shadow-lg">
      <h2 className="text-xl font-semibold mb-6 text-center">Edit Job</h2>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Title</Label>
            <Input name="title" value={jobData.title} onChange={handleChange} />
          </div>

          <div>
            <Label>Description</Label>
            <Input name="description" value={jobData.description} onChange={handleChange} />
          </div>

          <div>
            <Label>Requirements</Label>
            <Input name="requirements" value={jobData.requirements} onChange={handleChange} />
          </div>

          <div>
            <Label>Salary</Label>
            <Input type="text" name="salary" value={jobData.salary} onChange={handleChange} />
          </div>

          <div>
            <Label>Location</Label>
            <Input name="location" value={jobData.location} onChange={handleChange} />
          </div>

          <div>
            <Label>Job Type</Label>
            <Input name="jobType" value={jobData.jobType} onChange={handleChange} />
          </div>

          <div>
            <Label>Experience Level</Label>
            <Input
              type="text"
              name="experience"
              value={jobData.experience}
              onChange={handleChange}
            />
          </div>

          <div>
            <Label>No. of Positions</Label>
            <Input
              type="number"
              name="position"
              value={jobData.position}
              onChange={handleChange}
            />
          </div>

          <div>
            <Label>Industry</Label>
            <Select onValueChange={handleIndustryChange} value={jobData.industry}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Industry" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {industryList.map((item, idx) => (
                    <SelectItem key={idx} value={item}>
                      {item}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Deadline</Label>
            <Input type="date" name="deadline" value={jobData.deadline} onChange={handleChange} />
          </div>
        </div>

        <Button type="submit" className="w-full mt-6" disabled={loading}>
          {loading ? 'Updating...' : 'Update Job'}
        </Button>
      </form>
    </div>
  );
};

export default EditJob;
