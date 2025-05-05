import React, { useEffect, useState } from 'react';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Label } from './ui/label';
import { useDispatch } from 'react-redux';
import { setSearchedQuery } from '@/redux/jobSlice';

const filterData = [
  {
    filterType: "Location",
    array: ["Delhi", "Banglore", "Hyderabad", "Pune", "Mumbai"]
  },
  {
    filterType: "Industry",
    array: [
      "Frontend Developer",
      "Backend Developer",
      "FullStack Developer",
      "Cloud Engineer",
      "DevOps Engineer",
      "Machine Learning Engineer",
      "AI/ML Engineer",
      "Data Scientist",
      "Cybersecurity Engineer",
      "Blockchain Developer",
      "Game Developer",
      "Mobile Developer",
      "Product Manager",
      "UI/UX Designer",
      "QA Tester",
      "Others"
    ]
  },
  {
    filterType: "Salary",
    array: ["0-40k", "42-1lakh", "1lakh to 5lakh"]
  }
];

const FilterCard = () => {
  const [selectedValue, setSelectedValue] = useState('');
  const dispatch = useDispatch();

  const changeHandler = (value) => {
    setSelectedValue(value);
  };

  useEffect(() => {
    if (!selectedValue) {
      dispatch(setSearchedQuery({ type: "", value: "" }));
      return;
    }

    const isSalaryRange = ["0-40k", "42-1lakh", "1lakh to 5lakh"].includes(selectedValue);

    if (isSalaryRange) {
      dispatch(setSearchedQuery({ type: "salary", value: selectedValue }));
    } else {
      dispatch(setSearchedQuery({ type: "text", value: selectedValue }));
    }
  }, [selectedValue, dispatch]);

  return (
    <div className='w-full bg-white p-3 rounded-md'>
      <h1 className='font-bold text-lg'>Filter Jobs</h1>
      <hr className='mt-3' />
      <RadioGroup value={selectedValue} onValueChange={changeHandler}>
        {filterData.map((data, index) => (
          <div key={index}>
            <h1 className='font-bold text-lg mt-3'>{data.filterType}</h1>
            {data.array.map((item, idx) => {
              const itemId = `id-${index}-${idx}`;
              return (
                <div className='flex items-center space-x-2 my-2' key={itemId}>
                  <RadioGroupItem value={item} id={itemId} />
                  <Label htmlFor={itemId}>{item}</Label>
                </div>
              );
            })}
          </div>
        ))}
      </RadioGroup>
    </div>
  );
};

export default FilterCard;
