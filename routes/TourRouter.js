const express = require("express");
const router = express.Router();

const tourController = require('../controllers/TourController');
const { authUserMiddleware, authAdminMiddleware } = require("../middleware/authMiddeware");

router.post("/create", tourController.createTour);
router.get("/get-tours", tourController.getTours);
router.get("/get-tour/:id", tourController.getDetailTour);
router.put('/update/:id', tourController.updateTour);
router.delete('/delete/:id', tourController.deleteTour);
router.get("/unique-values/:attr", tourController.getUniqueValuesByAttr)

module.exports = router;