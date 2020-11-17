function createEmployee(baseSalary, overtime, rate) {
  return {
    baseSalary,
    overtime,
    rate
  };
}

let employees = {
  john : createEmployee(6000, 10, 50),
  slava : createEmployee(500, 9, 19),
  computeWage: function(employee) {
    return employee.baseSalary + (employee.overtime * employee.rate);
  },
  computeOvertimeMoney: function(employee) {
    return employee.overtime * employee.rate;
  },
};

console.log(employees.computeOvertimeMoney(employees.slava));