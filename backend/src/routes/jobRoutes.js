const router = require("express").Router()
const upload = require("../middleware/uploadMiddleware")
const {jobSchema, validateJob}= require("../validators/jobValidator")

const { protectedRoute, authorizedRoute } = require("../middleware/authMiddleware")
const  {createJob, getJobs, updatedJob, getMyJob, deleteJob} = require("../controllers/jobController");

router.get("/get-jobs", getJobs);
router.get("/get-job/:id", getMyJob);
router.post("/create-job", protectedRoute, authorizedRoute, upload.array("attachments", 5), validateJob(jobSchema), createJob);
router.patch("/update-job/:id", protectedRoute, authorizedRoute, updatedJob);
router.delete("delete-job", protectedRoute, authorizedRoute, deleteJob);

module.exports = router;