import express from 'express';
const app = express();
const port = process.env.PORT || 3000;

// Serve the static files from the Vite build
app.use(express.static('dist'));

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
