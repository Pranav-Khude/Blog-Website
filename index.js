const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const Blog = require('./models/blog');

const userRoute = require('./routes/user');
const blogRoute = require('./routes/blog');


const { checkForAuthenticationCookie } = require('./middlewares/authentication');

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/blogify')
    .then(() => console.log('Connected to database'))
    .catch(err => console.log('Error connecting to database:', err));

// Set EJS as the templating engine
app.set('view engine', 'ejs');
app.set('views', path.resolve('./views'));

// Middleware

app.use(express.static(path.resolve('./public')));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Custom middleware for authentication
app.use(checkForAuthenticationCookie('token'));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.get('/',async (req, res) => {
    const allBlogs=await Blog.find({});

    res.render('home', {
         user: req.user,
         blogs:allBlogs
    });
});

app.use('/user', userRoute);
app.use('/blog', blogRoute);


// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
