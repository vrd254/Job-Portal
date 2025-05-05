import React, { useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';

const ChatBot = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [mainOptions, setMainOptions] = useState(true);
  const [showJobCategories, setShowJobCategories] = useState(false);
  const [showLocationOptions, setShowLocationOptions] = useState(false);
  const [showSalaryOptions, setShowSalaryOptions] = useState(false);
  const [showCompanyOptions, setShowCompanyOptions] = useState(false);

  const user = useSelector((state) => state.auth?.user);
  const username = user?.fullname?.split(' ')[0] || 'there';

  const jobCategories = [
    'Full Stack Developer', 'Backend Developer', 'Cloud Engineer',
    'IOS Developer', 'Software Development Engineer',
    'Hardware Engineer', 'Frontend Developer'
  ];

  const locations = ['Delhi', 'Banglore', 'Hyderabad', 'Pune', 'Mumbai'];
  const salaries = ['Upto 5 Lakh', 'Upto 10 Lakh', 'Upto 15 Lakh', 'Upto 50 Lakh'];

  const companies = [
    'Amazon', 'AMD', 'Apple', 'Facebook', 'IBM', 'Microsoft',
    'Paypal', 'Google', 'Netflix', 'amzn', 'snapchat', 'instagram', 'amd'
  ];

  const toggleChat = () => {
    setOpen(!open);
    if (!open && messages.length === 0) {
      startChat();
    }
  };

  const startChat = () => {
    setMessages([{ sender: 'bot', text: `Hi, ${username}! 👋 What would you like to explore?` }]);
    setMainOptions(true);
    setShowJobCategories(false);
    setShowLocationOptions(false);
    setShowSalaryOptions(false);
    setShowCompanyOptions(false);
  };

  const handleSend = () => {
    if (!input.trim()) return;
    const userMessage = { sender: 'user', text: input };
    setMessages([...messages, userMessage]);
    setTimeout(() => {
      const botReply = getBotReply(input);
      setMessages(prev => [...prev, { sender: 'bot', text: botReply }]);
    }, 500);
    setInput('');
  };

  const getBotReply = (input) => {
    const msg = input.toLowerCase();
    if (msg.includes('job')) {
      setShowJobCategories(true);
      return "Sure! What type of jobs are you interested in?";
    }
    return "Try selecting Jobs, Salary, Location, or Company.";
  };

  const handleMainOption = (option) => {
    setMessages(prev => [...prev, { sender: 'user', text: option }]);
    setMainOptions(false);
    setShowJobCategories(false);
    setShowLocationOptions(false);
    setShowSalaryOptions(false);
    setShowCompanyOptions(false);

    switch (option) {
      case 'Jobs':
        setMessages(prev => [...prev, { sender: 'bot', text: 'Please select a job category below.' }]);
        setShowJobCategories(true);
        break;
      case 'Salary':
        setMessages(prev => [...prev, { sender: 'bot', text: 'Select your preferred salary range:' }]);
        setShowSalaryOptions(true);
        break;
      case 'Location':
        setMessages(prev => [...prev, { sender: 'bot', text: 'Choose your city of interest:' }]);
        setShowLocationOptions(true);
        break;
      case 'Company':
        setMessages(prev => [...prev, { sender: 'bot', text: 'Select a company to view their jobs:' }]);
        setShowCompanyOptions(true);
        break;
      default:
        break;
    }
  };

  const fetchJobs = async (type, value) => {
    setMessages(prev => [
      ...prev,
      { sender: 'user', text: value },
      { sender: 'bot', text: `Fetching jobs for ${value}...` }
    ]);
    setShowJobCategories(false);
    setShowLocationOptions(false);
    setShowSalaryOptions(false);
    setShowCompanyOptions(false);

    try {
      const res = await axios.get(`http://localhost:8000/api/v1/job/get`, {
        withCredentials: true,
      });

      let filtered = res.data.jobs;

      if (type === 'category') {
        filtered = filtered.filter(job =>
          job.title.toLowerCase().includes(value.toLowerCase())
        );
      } else if (type === 'location') {
        filtered = filtered.filter(job =>
          job.location.toLowerCase().includes(value.toLowerCase())
        );
      } else if (type === 'salary') {
        const limit = parseInt(value.replace(/[^0-9]/g, ''));
        filtered = filtered.filter(job =>
          (job.salaryTo || job.salaryFrom || 0) <= limit
        );
      } else if (type === 'company') {
        filtered = filtered.filter(job =>
          job.company?.name?.toLowerCase().includes(value.toLowerCase())
        );
      }

      if (filtered.length === 0) {
        setMessages(prev => [
          ...prev,
          { sender: 'bot', text: `Sorry, no jobs found for ${value}.` }
        ]);
        return;
      }

      filtered.slice(0, 3).forEach(job => {
        setMessages(prev => [
          ...prev,
          {
            sender: 'bot',
            text: `📌 ${job.title} at ${job.company?.name || 'Unknown'}\n📍 ${job.location}\n💰 ₹${job.salaryFrom} - ₹${job.salaryTo}\n🕒 Deadline: ${job.deadline}`
          }
        ]);
      });

    } catch (err) {
      console.error(err);
      setMessages(prev => [
        ...prev,
        { sender: 'bot', text: 'Something went wrong while fetching jobs.' }
      ]);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!open ? (
        <button
          onClick={toggleChat}
          className="bg-blue-600 text-white rounded-full w-14 h-14 text-2xl shadow-lg hover:scale-105 transition-all duration-300"
        >
          💬
        </button>
      ) : (
        <div className="w-80 h-[30rem] bg-white rounded-xl shadow-2xl flex flex-col overflow-hidden border border-gray-300">
          <div className="bg-blue-600 text-white px-4 py-2 flex justify-between items-center">
            <h2 className="text-md font-semibold">JobFinder Bot</h2>
            <div className="flex items-center gap-3">
              <button
                onClick={startChat}
                className="text-white text-sm bg-white bg-opacity-20 px-2 py-1 rounded hover:bg-opacity-40"
              >
                🏠 Home
              </button>
              <button onClick={toggleChat} className="text-white font-bold text-xl">×</button>
            </div>
          </div>

          <div className="flex-1 p-2 overflow-y-auto bg-gray-100 space-y-1">
            {messages.map((msg, idx) => (
              <div key={idx} className={`whitespace-pre-wrap ${msg.sender === 'bot' ? 'text-left' : 'text-right'}`}>
                <span className={`inline-block p-2 rounded-lg ${msg.sender === 'bot' ? 'bg-blue-200' : 'bg-green-200'}`}>
                  {msg.text}
                </span>
              </div>
            ))}

            {mainOptions && (
              <div className="flex flex-wrap gap-2 mt-2">
                {['Jobs', 'Salary', 'Location', 'Company'].map((option, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleMainOption(option)}
                    className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}

            {showJobCategories && (
              <div className="flex flex-wrap gap-2 mt-2">
                {jobCategories.map((cat, idx) => (
                  <button
                    key={idx}
                    onClick={() => fetchJobs('category', cat)}
                    className="bg-indigo-500 text-white px-2 py-1 rounded text-sm hover:bg-indigo-600"
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}

            {showLocationOptions && (
              <div className="flex flex-wrap gap-2 mt-2">
                {locations.map((city, idx) => (
                  <button
                    key={idx}
                    onClick={() => fetchJobs('location', city)}
                    className="bg-yellow-500 text-white px-2 py-1 rounded text-sm hover:bg-yellow-600"
                  >
                    {city}
                  </button>
                ))}
              </div>
            )}

            {showSalaryOptions && (
              <div className="flex flex-wrap gap-2 mt-2">
                {salaries.map((range, idx) => (
                  <button
                    key={idx}
                    onClick={() => fetchJobs('salary', range)}
                    className="bg-green-600 text-white px-2 py-1 rounded text-sm hover:bg-green-700"
                  >
                    {range}
                  </button>
                ))}
              </div>
            )}

            {showCompanyOptions && (
              <div className="flex flex-wrap gap-2 mt-2">
                {companies.map((company, idx) => (
                  <button
                    key={idx}
                    onClick={() => fetchJobs('company', company)}
                    className="bg-purple-500 text-white px-2 py-1 rounded text-sm hover:bg-purple-600"
                  >
                    {company}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="p-2 flex gap-2 border-t">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 border border-gray-300 rounded px-2 py-1"
              placeholder="Type a message..."
            />
            <button onClick={handleSend} className="bg-blue-600 text-white px-3 py-1 rounded">
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBot;
