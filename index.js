const express = require ('express')
const jwt = require('jsonwebtoken')
const connectDB = require('./db.js')
const itemModel = require('./models/Item.js')
const cors = require('cors');
const multer = require('multer')
const path = require('path');
const { default: mongoose } = require('mongoose');
const { type } = require('os');
const { log } = require('console');
const app = express();
app.use(express.json());
app.use(cors());

connectDB()

//Image Storage Engine

const storage = multer.diskStorage({
    destination: './upload/images',
    filename: (req,file,cb)=>{
        return cb(null, `${file.filename}_${Date.now()}${path.extname(file.originalname)}`)
    }
})
const upload = multer({storage:storage})

// Creating upload end point for upload
app.use('/images',express.static('upload/images'))

app.post("/upload",upload.single('product'),(req,res)=>{
    res.json({
        success:1,
        image_url:`http://localhost:${4000}/images/${req.file.filename}`
    })
})
// Schema for creating images
const Product = mongoose.model("Product",{
    id:{
        type: Number,
        require:true,
    },
    name:{
        type:String,
        require:true,
    },
    image:{
        type:String,
        require:true,
    },
    category:{
        type:String,
        require:true,
    },
    price:{
        type:Number,
        require:true,
    },
    date:{
        type:Date,
        default:Date.now,
    },
})
app.post('/addproduct', async(req,res)=>{
    let products = await Product.find({});
    let id;
    if(products.length>0){
        let last_product_array = products.slice(-1);
        let last_product = last_product_array[0];
        id= last_product.id+1;
    }else{
        id=1;
    }
    const product = new Product({
        id:id,
        name:req.body.name,
        image:req.body.image,
        category:req.body.category,
        price:req.body.price,
    });
    console.log(product);
    await product.save();
    console.log("Saved");
    res.json({
        success:true,
        name:req.body.name,
    })
})
// creating  API for deleting product
app.post('/removeproduct',async(req,res)=>{
    await Product.findOneAndDelete({id:req.body.id});
    console.log("Removed");
    res.json({
        success:true,
        name:req.body.name
    })
})
// Creating API for getting all products

app.get('/allproducts', async(req,res)=>{
    let products = await Product.find({});
    console.log('All Products Fetched');
    res.send(products);
})

// Signup API
app.post('/signup', async (req, res)=> {
    
    let check = await itemModel.findOne({email: req.body.email});
    if (check) {
        return  res.status(400).json({success:false, errors:"exiting user found with same email id"})
    }
    let cart ={};
    for (let i =0; i<300; i++){
        cart[i] =0;
    }
    const user = new itemModel({
        name:req.body.username,
        email:req.body.email,
        password:req.body.password,
        cartData:cart,
    })
    await user.save();

    const data = {
        user:{
            id:user.id
        }
    }
    const token = jwt.sign(data, 'secret_ecom');
    res.json({success:true, token})
})
// login API
app.post('/login', async (req, res)=> {
    let user = await itemModel.findOne({email:req.body.email});
    if (user) {
        const passCompare = req.body.password === user.password;
        if (passCompare) {
            const data = {
                user: {
                    id:user.id
                }
            }
            const token = jwt.sign(data, 'secret_ecom');
            res.json({success:true, token});
        }
        else{
            res.json({success:false, errors:"Wrong Password"});
        }
    }
    else{
        res.json({success:false, errors: "Wrong Email Id"})
    }

})
app.listen(4000, ()=> {
    console.log("app is running");
})