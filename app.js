const express = require('express')
const app = express()
const multer = require('multer')
const path = require('path')


app.use(express.static(path.join(__dirname,'/views')))
app.use(express.static(path.join(__dirname,'/public')))


// Storage Engine
const storage = multer.diskStorage({
    destination: 'public/uploads',
    filename: function(req,file,cb){
        cb(null, file.fieldname + '-' + Date.now()+ path.extname(file.originalname))
    }
})

// Init Upload
const upload = multer({
    storage: storage,
    limits:{fileSize: 1000000},
    fileFilter: function(req, file, cb){
        checkFileType(file, cb)
    }
}).single('myImage')

app.set('view engine', 'ejs')

app.get('/',(req,res)=>{
    res.render('index')
})


// Upload Route
app.post('/upload',(req,res)=>[
    upload(req,res,(err)=>{
        if(err){
            res.render('index',{
                msg: err,
            })
        }else{
            // console.log(req.file)  // Here req.file provides the data that can be used for uplaoding it to MongoDB
            if(req.file == undefined){
                res.render('index',{
                    msg:'Error: No file selected!'
                })
            }else{
                res.render('index',{
                    msg:'File Uploaded',
                    file:`uploads/${req.file.filename}`
                })
            }
        }
    })
])


app.listen(3000,()=>{
    console.log('Starting the server on port 3000')
})

// Check File Type
function checkFileType(file, cb){
    // Allowed Extension
    const fileTypes = /jpeg|jpg|png|gif/;
    // Check the extension
    const extName = fileTypes.test(path.extname(file.originalname).toLowerCase())
    // Check mime type
    const mimetype = fileTypes.test(file.mimetype)

    if(mimetype && extName){
        return cb(null, true)
    }else{
        cb('Error: Images Only')
    }
}