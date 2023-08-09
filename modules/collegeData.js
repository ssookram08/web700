const fs = require("fs");
// const { Student, Course } = require("../model");
const { Sequelize } = require("sequelize");
const sequelize = new Sequelize(
  "postgres://xatoenot:Yi5ToU3Sm6L83KWyBbo7pBBUKiff75O9@batyr.db.elephantsql.com/xatoenot"
);

const Course = sequelize.define("Course", {
  courseId: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  courseCode: {
    type: Sequelize.STRING,
  },
  courseDescription: {
    type: Sequelize.STRING,
  },
});

const Student = sequelize.define("Student", {
  studentNum: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  firstName: {
    type: Sequelize.STRING,
  },
  lastName: {
    type: Sequelize.STRING,
  },
  email: {
    type: Sequelize.STRING,
  },
  addressStreet: {
    type: Sequelize.STRING,
  },
  addressCity: {
    type: Sequelize.STRING,
  },
  addressProvince: {
    type: Sequelize.STRING,
  },
  TA: {
    type: Sequelize.BOOLEAN,
  },
  status: {
    type: Sequelize.STRING,
  },
});

Course.hasMany(Student, {foreignKey: 'course'});

function initialize() {
  return new Promise((resolve, reject) => {
    sequelize.sync().then(val => resolve('success')).catch(err => {
      reject("unable to sync the database");
    });
  });
}

function getAllStudents() {
  return Student.findAll({order: [['studentNum', 'ASC']]}).then(students => {
    return JSON.parse(JSON.stringify(students));
  }).catch(err => {
    return "no results returned";
  });
}

function addStudent(studentData) {
  studentData.TA = studentData.TA ? true : false;

  for (const prop in studentData) {
    if (studentData[prop] === "") {
      studentData[prop] = null;
    }
  }
  studentData.course = Number(studentData.course);
  return new Promise((resolve, reject) => {
    Student.create(studentData)
      .then(createdStudent => {
        resolve(); 
      })
      .catch(error => {
        console.error(error)
        reject('Unable to create student');
      });
  });
}

function getTAs() {
  return Student.findAll({ where: {
    TA: true
  }}).then(students => {
    return JSON.parse(JSON.stringify(students));
  }).catch(err => {
    return "no results returned";
  });
}

function getCourseById(id) {
  return Course.findOne({ where: {courseId: id}}).then(course => {
    return JSON.parse(JSON.stringify(course));
  }).catch(err => {
    return "no results returned";
  });
}

function getCourses() {
  return Course.findAll().then(course => {
    return JSON.parse(JSON.stringify(course));
  }).catch(err => {
    return "no results returned";
  });
}
function getStudentsByCourse(course) {
  return Student.findAll({ where: {course}}).then(students => {
    return JSON.parse(JSON.stringify(students));
  }).catch(err => {
    return "no results returned";
  });
}

function updateStudent(studentData) {
  return Student.update(studentData, {
    where: {
      studentNum: studentData.studentNum,
    },
  }).then(students => {
    return JSON.parse(JSON.stringify(students));
  }).catch(err => {
    return "no results returned";
  });
}

function getStudentByNum(num) {
  return Student.findOne({ where: {studentNum: num}}).then(students => {
    return JSON.parse(JSON.stringify(students));
  }).catch(err => {
    return "no results returned";
  });
}

function addCourse(courseData) {
  for (const prop in courseData) {
    if (courseData[prop] === "") {
      courseData[prop] = null;
    }
  }

  return Course.create(courseData)
  .then(createdCourse => {
    resolve(); 
  })
  .catch(err => {
    return "no results returned";
  });
}

function updateCourse(courseData) {
  for (const prop in courseData) {
    if (courseData[prop] === "") {
      courseData[prop] = null;
    }
  }

  return Course.update(courseData, {
    where: {
      courseId: courseData.courseId,
    },
  })
  .then(createdCourse => {
    resolve(); 
  })
  .catch(err => {
    return "no results returned";
  });
}
function deleteCourseById(id) {

  return Course.destroy({
    where: {
      courseId: id,
    }
  })
  .then(() => {
    resolve(); 
  })
  .catch(err => {
    return "no results returned";
  });
}
function deleteStudentByNum(id) {

  return Student.destroy({
    where: {
      studentNum: id,
    }
  })
  .then(() => {
    resolve(); 
  })
  .catch(err => {
    return "no results returned";
  });
}

module.exports = {
  initialize,
  getAllStudents,
  getTAs,
  getCourses,
  getStudentByNum,
  addStudent,
  getCourseById,
  updateStudent,
  addCourse,
  updateCourse,
  deleteCourseById,
  deleteStudentByNum,
  getStudentsByCourse,
};
