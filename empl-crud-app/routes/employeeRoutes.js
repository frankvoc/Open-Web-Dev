const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');
router.get('/create', (req, res) => {
    res.render('index');
  });
//create a new employee
router.post('/', employeeController.createEmployee);

//read all employees
router.get('/', employeeController.getEmployees);

//Create update form
router.get('/update/:id', employeeController.renderUpdateForm);

//update that employee
router.post('/update/:id', employeeController.updateEmployee);

//delete
router.get('/delete/:id', employeeController.deleteEmployee);

module.exports = router;
