import React, { useState } from 'react';
import Navbar from '../shared/Navbar';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { useSelector } from 'react-redux';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '../ui/select';
import axios from 'axios';
import { JOB_API_END_POINT } from '@/utils/constant';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

const PostJob = () => {
  const [input, setInput] = useState({
    title: '',
    description: '',
    requirements: '',
    salary: '',
    location: '',
    jobType: '',
    experience: '',
    position: 0,
    companyId: '',
    deadline: '',
    industry: ''
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { companies } = useSelector(store => store.company);

  const changeEventHandler = e => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const selectChangeHandler = value => {
    const selectedCompany = companies.find(
      company => company.name.toLowerCase() === value
    );
    setInput({ ...input, companyId: selectedCompany._id });
  };

  const submitHandler = async e => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await axios.post(`${JOB_API_END_POINT}/post`, input, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true
      });
      if (res.data.success) {
        toast.success(res.data.message);
        navigate('/admin/jobs');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar />
      <div className='flex justify-center w-full px-4 py-8'>
        <form
          onSubmit={submitHandler}
          className='bg-white w-full max-w-4xl p-6 md:p-8 border border-gray-200 shadow-lg rounded-xl'
        >
          <h2 className='text-xl font-semibold mb-4 text-center'>Post a New Job</h2>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div>
              <Label>Title</Label>
              <Input name='title' value={input.title} onChange={changeEventHandler} />
            </div>
            <div>
              <Label>Description</Label>
              <Input name='description' value={input.description} onChange={changeEventHandler} />
            </div>
            <div>
              <Label>Requirements</Label>
              <Input name='requirements' value={input.requirements} onChange={changeEventHandler} />
            </div>
            <div>
              <Label>Salary</Label>
              <Input
                type='text'
                name='salary'
                value={input.salary}
                onChange={changeEventHandler}
              />
            </div>
            <div>
              <Label>Location</Label>
              <Input name='location' value={input.location} onChange={changeEventHandler} />
            </div>
            <div>
              <Label>Job Type</Label>
              <Input name='jobType' value={input.jobType} onChange={changeEventHandler} />
            </div>
            <div>
              <Label>Experience Level</Label>
              <Input name='experience' value={input.experience} onChange={changeEventHandler} />
            </div>
            <div>
              <Label>No. of Positions</Label>
              <Input
                type='number'
                name='position'
                value={input.position}
                onChange={changeEventHandler}
              />
            </div>
            <div>
              <Label>Industry</Label>
              <Select
                onValueChange={value => setInput({ ...input, industry: value })}
              >
                <SelectTrigger className='w-full'>
                  <SelectValue placeholder={input.industry || 'Select Industry'} />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {[
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
                    ].map((industry, idx) => (
                      <SelectItem key={idx} value={industry}>
                        {industry}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mt-4'>
            <div>
              <Label>Deadline</Label>
              <Input
                type='date'
                name='deadline'
                value={input.deadline}
                onChange={changeEventHandler}
              />
            </div>
            <div>
              {companies.length > 0 && (
                <>
                  <Label>Select Company</Label>
                  <Select onValueChange={selectChangeHandler}>
                    <SelectTrigger className='w-full'>
                      <SelectValue placeholder='Select a Company' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {companies.map(company => (
                          <SelectItem
                            key={company._id}
                            value={company?.name?.toLowerCase()}
                          >
                            {company.name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </>
              )}
            </div>
          </div>

          {loading ? (
            <Button className='w-full mt-6' disabled>
              <Loader2 className='mr-2 h-4 w-4 animate-spin' />
              Please wait
            </Button>
          ) : (
            <Button type='submit' className='w-full mt-6'>
              Post New Job
            </Button>
          )}

          {companies.length === 0 && (
            <p className='text-sm text-red-600 font-semibold text-center mt-4'>
              *Please register a company first, before posting a job.
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default PostJob;
