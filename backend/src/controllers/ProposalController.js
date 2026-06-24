const Proposal = require("../models/proposal");
const Job = require("../models/Jobs");


exports.SubmitProposalByFreelancer =  async(req, res, next)=>{
    try{
        
    const job = await Job.findById(req.params.id)
  if (!job || job.status !== 'open')
    return res.status(400).json({ success:false, message:'Job not available' });
const existingProposal = await Proposal.findOne({
    job: job._id,
    freelancer: req.user.id
});

if (existingProposal) {
    return res.status(400).json({
        success: false,
        message: "You already submitted a proposal."
    });
}

  const attachments = req.files ? req.files.map(f => f.path) : [];

  const proposal = await Proposal.create({
    job:          job._id,
    freelancer:   req.user.id,
    coverLetter:  req.body.coverLetter,
    bidAmount:    req.body.bidAmount,
    deliveryDays: req.body.deliveryDays,
    attachments
  });

  job.proposals.push(proposal._id);
  await job.save();
  res.status(201).json({success: true, message: "new proposal is createde", proposal})

    }catch(err){
        next(err)
    }
 

}

exports.getProposalByFreelancer = async (req, res, next)=>{
    try{
          const myProposals = await Proposal.find({freelancer: req.user.id}).populate("job", "title category budget status").Sort({createdAt: -1});
    if(myProposals.length === 0) return res.status(404).json({success: false, message: "you dont have proposals"})
      return res.status(200).json({success: true, message: "done", myProposals})   
    }catch(err){
        next(err)
    }
  

}
//get proposals of my job 
exports.getJobPrposalsByClient = async (req,res, next)=> {
    try{
        //find job
        const job = await Job.findById(req.params.id);
        if(!job) return res.status(404).json({success: false, message: "there is no job"});
        //certain the job is mine 
        if (job.client.toString() !== req.user.id.toString()) return res.status(403).json({ success:false, message:'Not your job'});
        //find propsal that contain my job id
        const proposals = await Proposal.find({job: job._id}).populate('freelancer', 'name avatar bio skills hourlyRate').Sort({createdAt: -1});
        res.status(200).json({success: true, proposals})

    
    }catch(err){
        next(err)
    }

}
exports.updatePropsalStatusByClient = async (req,res, next)=>{
    try{
        //find propsal by id
        const proposal =await Proposal.findById(req.params.id).populate("job");
        if(!proposal) return res.status(404).json({success:false, message: "propsal is not found"})
        //ceatain i have job that has propsal
    if(proposal.job.client.toString() !== req.user.id.toString()) return res.status(403).json({success:false, message: "not authorized"})
        //certain that job status is not inprogress and status is not accepted
    if(proposal.status === "accepted" && proposal.job.status === "in progress")return res.status(400).json({success:false, message: "job is already assigned"})
        //extract propsal status
    const {status} = req.body;
        //certain status is not withdrown
        if(!['accepted', 'rejected'].includes(status)) return res.status(400).json({success:false, message: "status is invalid"})
        //change propsal status
        proposal.status = status;
        await proposal.save();
        if(proposal.status === "accepted") {
            proposal.job.status = "in progress"
            await proposal.job.save();
            if (status === "accepted") {
    proposal.job.status = "in progress";
    await proposal.job.save();

    await Proposal.updateMany(
        {
            job: proposal.job._id,
            _id: { $ne: proposal._id }
        },
        {
            status: "rejected"
        }
    );
}
        }
        res.status(200).json({
    success: true,
    message: "Proposal updated successfully",
    proposal
});

    }catch(err){
        next(err)
    }
}

exports.withdrawProposalByFreelancer = async (req, res, next) => {
    try {
        const myProposal = await Proposal.findById(req.params.id);

        if (!myProposal) {
            return res.status(404).json({
                success: false,
                message: "Proposal not found"
            });
        }

        if (
            myProposal.freelancer.toString() !==
            req.user.id.toString()
        ) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized"
            });
        }

        if (myProposal.status !== "pending") {
            return res.status(400).json({
                success: false,
                message: "You can only withdraw pending proposals."
            });
        }

        myProposal.status = "withdrawn";

        await myProposal.save();

        res.status(200).json({
            success: true,
            message: "Proposal withdrawn successfully",
            proposal: myProposal
        });

    } catch (err) {
        next(err);
    }
};
