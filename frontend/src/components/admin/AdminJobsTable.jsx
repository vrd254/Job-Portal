import React, { useEffect, useState } from 'react'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Edit2, Eye, MoreHorizontal } from 'lucide-react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Badge } from '../ui/badge'

const AdminJobsTable = () => {
    const { allAdminJobs, searchJobByText } = useSelector(store => store.job);
    const [filterJobs, setFilterJobs] = useState(allAdminJobs);
    const navigate = useNavigate();

    useEffect(() => {
        const filteredJobs = allAdminJobs.filter((job) => {
            if (!searchJobByText) return true;
            return job?.title?.toLowerCase().includes(searchJobByText.toLowerCase()) ||
                   job?.company?.name.toLowerCase().includes(searchJobByText.toLowerCase());
        });
        setFilterJobs(filteredJobs);
    }, [allAdminJobs, searchJobByText]);

    return (
        <div>
            <Table>
                <TableCaption>A list of your recently posted jobs</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>Company Name</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Deadline</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {
                        filterJobs?.map((job) => {
                            const deadline = job?.deadline ? new Date(job.deadline).toLocaleDateString() : "NA";
                            const isExpired = job?.deadline && new Date(job.deadline) < new Date();

                            return (
                                <TableRow
                                    key={job._id}
                                    className={`${isExpired ? 'bg-red-50 border border-red-200' : ''}`}
                                >
                                    <TableCell>
                                        {job?.company?.name}
                                        {isExpired && (
                                            <Badge className="ml-2 bg-red-600 text-white">Expired</Badge>
                                        )}
                                    </TableCell>
                                    <TableCell>{job?.title}</TableCell>
                                    <TableCell>{job?.createdAt.split("T")[0]}</TableCell>
                                    <TableCell className={`${isExpired ? 'text-red-600 font-semibold' : ''}`}>
                                        {deadline}
                                    </TableCell>
                                    <TableCell className="text-right cursor-pointer">
                                        <Popover>
                                            <PopoverTrigger><MoreHorizontal /></PopoverTrigger>
                                            <PopoverContent className="w-32">

                                                {/* ✅ Disable Edit if expired */}
                                                <div
                                                    onClick={() => {
                                                        if (!isExpired) {
                                                            navigate(`/admin/jobs/${job._id}/edit`)
                                                        }
                                                    }}
                                                    
                                                    className={`flex items-center gap-2 w-fit cursor-pointer ${isExpired ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                >
                                                    <Edit2 className='w-4' />
                                                    <span>Edit</span>
                                                </div>

                                                {/* ✅ Applicants remains active */}
                                                <div
                                                    onClick={() => navigate(`/admin/jobs/${job._id}/applicants`)}
                                                    className='flex items-center w-fit gap-2 cursor-pointer mt-2'
                                                >
                                                    <Eye className='w-4' />
                                                    <span>Applicants</span>
                                                </div>
                                            </PopoverContent>
                                        </Popover>
                                    </TableCell>
                                </TableRow>
                            )
                        })
                    }
                </TableBody>
            </Table>
        </div>
    )
}

export default AdminJobsTable
