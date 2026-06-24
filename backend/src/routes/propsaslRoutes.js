const router = require("express").Router();
const upload = require("../middleware/uploadMiddleware");
const {createProposalSchema, validateProposal}= require("../validators/propsalValidator");

const { protectedRoute, authorizedRoute } = require("../middleware/authMiddleware")
const  {SubmitProposalByFreelancer, 
    getJobPrposalsByClient,
     getProposalByFreelancer,
      updatePropsalStatusByClient,
       withdrawProposalByFreelancer} = require("../controllers/ProposalController");


router.post("/", protectedRoute, authorizedRoute("freelancer" ), validateProposal(createProposalSchema), SubmitProposalByFreelancer)
router.get("/job/:id", protectedRoute, authorizedRoute("client" ),  getJobPrposalsByClient)
router.get("/my", protectedRoute, authorizedRoute("freelancer" ),  getProposalByFreelancer)
router.patch("/:id/status", protectedRoute, authorizedRoute("client" ), validateProposal(createProposalSchema), updatePropsalStatusByClient)
router.patch("/:id/withdraw", protectedRoute, authorizedRoute("freelancer" ), validateProposal(createProposalSchema), withdrawProposalByFreelancer)

module.exports = router;