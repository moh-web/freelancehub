const router = require("express").Router()
const upload = require("../middleware/uploadMiddleware")
const {jobSchema, validateJob}= require("../validators/jobValidator")

const { protectedRoute, authorizedRoute } = require("../middleware/authMiddleware")
const  {createJob, getJobs, updatedJob, getMyJob, deleteJob} = require("../controllers/jobController");

router.get("/get-jobs",protectedRoute, authorizedRoute("admin", "client", "freelancer" ), getJobs);
router.get("/get-job/:id",protectedRoute, authorizedRoute("admin", "client", "freelancer" ), getMyJob);
router.post("/create-job", protectedRoute, authorizedRoute("client"), upload.array("attachments", 5), validateJob(jobSchema), createJob);
router.patch("/update-job/:id", protectedRoute, authorizedRoute("admin", "client"), updatedJob);
router.delete("/delete-job/:id", protectedRoute, authorizedRoute("admin", "client"), deleteJob);

module.exports = router;