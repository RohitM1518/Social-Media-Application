import mongoose from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2"
const postSchema = new mongoose.Schema(
    {
    file:{
        type:String, //Video comes from cloudinary and saved as url
    },
    format:{
        type:String, 
    },
    content:{
        type:String, 
        required:true,
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
},{timestamps:true})

postSchema.plugin(mongooseAggregatePaginate) //used for quering 

export const Post = mongoose.model("Post",postSchema)