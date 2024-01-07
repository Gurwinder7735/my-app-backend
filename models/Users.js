let mongoose = require('mongoose');
let Schema = mongoose.Schema;
const { ObjectId } = mongoose.Schema;


var UserSchema = new Schema({
	'name' : String,
	'email' : String,
	'phoneNumber' : String,
	'description' : {
		type: String,
		default: ''
	},
	
	'password' : String,
	'address' : String,
	'isDeleted': { type: Boolean, default: false },
	'deviceType': { type: Number, default: '' },
	'deviceToken': { type: String, default: '' },
},{
	timestamps: true,
	versionKey: false
});	

// UserSchema.plugin(mongoosePaginate);

const user = mongoose.model('Users', UserSchema);

module.exports = user;