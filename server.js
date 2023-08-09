const express = require("express");
 const path = require("path");
 const collegeData = require("./modules/collegeData");
 const app = express();
 const HTTP_PORT = process.env.PORT || 8080;
 var exphbs = require("express-handlebars");
 
 app.engine(
   ".hbs",
   exphbs.engine({
     extname: ".hbs",
     helpers: {
       navLink: function (url, options) {
         return (
           "<li" +
           (url == app.locals.activeRoute
             ? ' class="nav-item active" '
             : ' class="nav-item" ') +
           '><a class="nav-link" href="' +
           url +
           '">' +
           options.fn(this) +
           "</a></li>"
         );
       },
       equal: function (lvalue, rvalue, options) {
         if (arguments.length < 3)
           throw new Error("Handlebars Helper equal needs 2 parameters");
         if (lvalue != rvalue) {
           return options.inverse(this);
         } else {
           return options.fn(this);
         }
       },
     },
   })
 );
 
 app.set("view engine", ".hbs");
 
 const publicPath = path.join(__dirname, "public");
 app.use(express.static(publicPath));
 
 app.use(express.urlencoded({ extended: true }));
 
 app.use(function (req, res, next) {
   let route = req.path.substring(1);
   app.locals.activeRoute =
     "/" +
     (isNaN(route.split("/")[1])
       ? route.replace(/\/(?!.*)/, "")
       : route.replace(/\/(.*)/, ""));
   next();
 });
 
 // setup a 'route' to listen on the default url path
 app.get("/students", (req, res) => {
   const { course } = req.query;
   collegeData
     .getAllStudents()
     .then((students) => {
       if (course) {
         let filtered = students.filter((val) => val.course === Number(course));
         if (filtered.length > 0) {
           res.render("students", { students: filtered });
         } else {
           res.render("students", { message: "no results" });
         }
       } else {
         res.render("students", { students });
       }
     })
     .catch((err) => {
       res.render("students", { message: "no results" });
     });
 });
 app.get("/student/:studentNum", (req, res) => {
   // initialize an empty object to store the values
   let viewData = {};
   collegeData
     .getStudentByNum(req.params.studentNum)
     .then((data) => {
       if (data) {
         viewData.student = data; //store student data in the "viewData" object as "student"
       } else {
         viewData.student = null; // set student to null if none were returned
       }
     })
     .catch(() => {
       viewData.student = null; // set student to null if there was an error
     })
     .then(collegeData.getCourses)
     .then((data) => {
       viewData.courses = data; // store course data in the "viewData" object as "courses"
       // loop through viewData.courses and once we have found the courseId that matches
       // the student's "course" value, add a "selected" property to the matching
       // viewData.courses object
       for (let i = 0; i < viewData.courses.length; i++) {
         if (viewData.courses[i].courseId == viewData.student.course) {
           viewData.courses[i].selected = true;
         }
       }
     })
     .catch(() => {
       viewData.courses = []; // set courses to empty if there was an error
     })
     .then(() => {
       if (viewData.student == null) {
         // if no student - return an error
         res.status(404).send("Student Not Found");
       } else {
         res.render("student", { viewData: viewData }); // render the "student" view
       }
     });
 });
 app.post("/student/update", (req, res) => {
   collegeData
     .updateStudent(req.body)
     .then(() => {
       res.redirect("/students");
     })
     .catch((err) => {
       res.status(500).send({ message: "no results" });
     });
 });
 app.get("/tas", (req, res) => {
   collegeData
     .getTAs()
     .then((tas) => {
       res.status(200).json(tas);
     })
     .catch((err) => {
       res.status(500).send({ message: "no results" });
     });
 });
 app.get("/", (req, res) => {
   res.render("home");
 });
 app.get("/about", (req, res) => {
   res.render("about");
 });
 app.get("/htmlDemo", (req, res) => {
   res.render("htmlDemo");
 });
 app.get("/students/add", async (req, res) => {
   let courses = (await collegeData.getCourses()) || [];
   res.render("addStudent", { courses });
 });
 
 app.post("/students/add", (req, res) => {
   collegeData
     .addStudent(req.body)
     .then(() => {
       res.redirect("/students");
     })
     .catch((err) => {
       res.status(500).send({ message: "no results" });
     });
 });
 
 app.post("/courses/update", (req, res) => {
   collegeData
     .updateCourse(req.body)
     .then(() => {
       res.redirect("/courses");
     })
     .catch((err) => {
       res.status(500).send({ message: "no results" });
     });
 });
 
 app.post("/courses/add", (req, res) => {
   collegeData
     .addCourse(req.body)
     .then(() => {
       res.redirect("/courses");
     })
     .catch((err) => {
       res.status(500).send({ message: "no results" });
     });
 });
 
 app.get("/courses/add", (req, res) => {
   res.render("addCourse");
 });
 app.get("/courses", (req, res) => {
   collegeData
     .getCourses()
     .then((courses) => {
       res.render("courses", { courses: courses });
     })
     .catch((err) => {
       res.render("courses", { message: "no results" });
     });
 });
 
 app.get("/course/:num", (req, res) => {
   const { num } = req.params;
   collegeData
     .getCourseById(Number(num))
     .then((course) => {
       res.render("course", { course: course });
     })
     .catch((err) => {
       res.status(404).send("Course Not Found");
     });
 });
 
 app.get("/course/delete/:id", (req, res) => {
   const { id } = req.params;
   collegeData
     .deleteCourseById(Number(id))
     .then(() => {
       res.redirect("/courses");
     })
     .catch((err) => {
       res.status(500).send("Unable to Remove Course / Course not found)");
     });
 });
 
 app.get("/students/delete/:id", (req, res) => {
   const { id } = req.params;
   collegeData
     .deleteStudentByNum(Number(id))
     .then(() => {
       res.redirect("/students");
     })
     .catch((err) => {
       res.status(500).send("Unable to Remove Student / Student not found)");
     });
 });
 // 404 Error Handler
 app.use((req, res, next) => {
   const filePath = path.join(__dirname, "views", "404.html");
   res.status(404).sendFile(filePath);
 });
 // setup http server to listen on HTTP_PORT
 collegeData
   .initialize()
   .then(() => {
     app.listen(HTTP_PORT, () => {
       console.log("server listening on port: " + HTTP_PORT);
     });
   })
   .catch((err) => {
     console.error(err);
   });
 