const Employee = require('../models/employee');

//create a new employee
exports.createEmployee = async (req, res) => {
  try {
    const employee = new Employee(req.body);
    await employee.save();
    res.redirect('/employees');
  } catch (err) {
    res.status(500).send(err);
  }
};

//read all employees
exports.getEmployees = async (req, res) => {
  try {
    const employees = await Employee.find();
    res.render('view', { employees });
  } catch (err) {
    res.status(500).send(err);
  }
};

//update an employee
exports.updateEmployee = async (req, res) => {
  try {
    const employee = await Employee.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.redirect('/employees');
  } catch (err) {
    res.status(500).send(err);
  }
};

//delete an employee
exports.deleteEmployee = async (req, res) => {
  try {
    await Employee.findByIdAndDelete(req.params.id);
    res.render('delete', { message: 'Employee deleted successfully' });
  } catch (err) {
    res.status(500).send(err);
  }
};

//create the update form based off passed ID
exports.renderUpdateForm = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    res.render('update', { employee });
  } catch (err) {
    res.status(500).send(err);
  }
};
