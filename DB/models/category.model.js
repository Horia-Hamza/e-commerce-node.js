import { Schema,model, Types} from "mongoose";
const categorySchema =new Schema({
name:{
    type:String,
    required:[true,'name is required'],
    min:[2,'min letters are 2'],
    max:[20,'max letters are 20'],
    lowercase:true,
    unique:true
},
createdBy: {
    type: Types.ObjectId,
    ref: 'User',
    required: [
        true,
        'can not add category without owner'
    ]
},
updatedBy: {
    type: Types.ObjectId,
    ref: 'User',
},
image:{
    type:String,
    required:[true,'image is required']
},
imagePublic_id:String
},{
    timestamps:true
})
export const categoryModel = model('Category',categorySchema)