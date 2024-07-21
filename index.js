import express from 'express';
import path from 'path';
import multer from 'multer';
import mergePdfs from './mergepdf.js'
import { fileURLToPath } from 'url';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use('/static', express.static('public'))
const upload = multer({ dest: 'uploads/' });

// const port = 3000
const PORT = process.env.PORT || 3000;


app.get('/',(req, res)=> {
    res.sendFile(path.join(__dirname, "templates/index.html"))
})
app.post('/merge', upload.array('pdfs', 2), async (req, res, next)=> {
    let d = await mergePdfs(path.join(__dirname, req.files[0].path), path.join(__dirname, req.files[1].path))
    res.redirect(`http://localhost:3000/static/${d}.pdf`)
    // res.send({data: req.files})
    // console.log(req.files)
})

const server = app.listen(PORT, ()=>{
    console.log(`Example app listening on port ${PORT}`)
})

server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use. Trying another port...`);
        setTimeout(() => {
            server.close(() => {
                server.listen(PORT + 1); // Try next port
            });
        }, 1000); // Delay before retrying
    } else {
        console.error(`Error starting server: ${err.message}`);
    }
});
