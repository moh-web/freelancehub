
const Job = require('../models/Jobs');


const createJob = async (req, res, next) => {
   
    try{
        const attachments = req.files ? req.files.map(file => file.path) : [];
        const newJob = await Job.create({ client:req.user._id, ...req.body, attachments});
        res.status(201).json(newJob);
    }catch (error) {
        next(error);
    }
}


//get all jobs
const getJobs = async (req, res, next) => {
    try {
        const { status, category, skillsRequired, sortBy, minBudget, maxBudget, search  } = req.query;
        const filter = {};
        if (search) {
            filter.$text = {$search: search}
        }
        if (status) {filter.status = status;}
        else{filter.status = "open"}
        if (category) filter.category = category;
        if (skillsRequired) filter.skillsRequired = { $in: skillsRequired.split(',') };
        if (minBudget || maxBudget) {
            filter.budget = {};
            if (minBudget) filter.budget.$gte = parseFloat(minBudget);
            if (maxBudget) filter.budget.$lte = parseFloat(maxBudget);
        }
        const sortOptions = {createdAt: -1}; // default sort by newest
     
         if (sortBy === 'oldest') sortOptions.createdAt = 1;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const jobs = await Job.find(filter).sort(sortOptions).populate('client', 'name avatar').populate({ path: 'proposals', populate: { path: 'freelancer', select: 'name avatar' } }).limit(limit).skip(skip);
        const totalJobs = await Job.countDocuments(filter);
        
        res.status(201).json({ success: true, data: {jobs, currentPage: page, totalPages: Math.ceil(totalJobs/limit), totalJobs} });
    }catch (error) {
        next(error);
    }

}
const deleteJob = async (req, res, next)=>{
    try{
        const id = req.params.id;
        const job = await Job.findById(id);
        if(!job)return res.status(404).json("jon not found");
        if(job.client.toString() !== req.user._id.toString()) return res.status(403).json("job is not yours");
        await job.deleteOne();
        res.status(200).json({success: true, message: "job is deleted"});
    }catch(err){
        next(err)
    }
}
const updatedJob = async (req, res, next) =>{

    try{
        const id = req.params.id;
        const existingJob = await Job.findById(id);

if (!existingJob)
    return res.status(404).json("job not found");

if (existingJob.client.toString() !==req.user._id.toString()) return res.status(403).json("job is not yours");
        const updatedJob = await Job.findByIdAndUpdate(id, req.body, {new: true});
        res.status(200).json({updatedJob, message: "job is updated", success: true})
    }catch(err){
        next(err)
    }
}
const getMyJob = async (req, res, next)=>{
    const id = req.params.id;
    try{
        const job = await Job.findById(id).populate("client", "name avatar").populate({path: "proposals", populate: {path: "freelancer", select: "name avatar"}})
        if(!job) return res.status(404).json("this job not found");
        res.status(200).json({job, message: "job is found", success: true});


    }catch(err){
        next(err);
    }
}
module.exports = {createJob, getJobs, updatedJob, getMyJob, deleteJob}