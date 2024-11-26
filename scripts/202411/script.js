require("dotenv").config();
const mongoose = require("mongoose");
var encrypt = require('mongoose-encryption');

// https://github.com/joegoldbeck/mongoose-encryption?tab=readme-ov-file#the-secure-way

const userSchema = mongoose.Schema(
	{
		schema: { type: String },
		userid: { type: String, required: true, unique: true },
		type: { type: String, required: true, enum: ["admin", "user"] },
		state: { type: String, required: true, enum: ["inactive", "active", "anonymous"] },
		name: { type: String, required: true },
		login: { type: String, required: true, unique: true },
		loginchange: { type: String },
		password: { type: String, required: true },
		communityid: { type: String, required: true },
		passwordtoken: { type: String },
		lastconnection: { type: Date },
		anonymisationnotice: { type: Date },
		failedconnections:[{ type: Date }],
	},
	{ strict: true }
);

let DB_URL =
    "mongodb+srv://" +
    process.env.DB_PW +
    "@" +
    process.env.DB_CLUSTER +
    "?retryWrites=true&w=majority&appName=" + 
    process.env.DB_APPNAME;
    
// Connect
mongoose
.connect(DB_URL, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
})
.then(() => {
	console.log("Connexion à MongoDB réussie");
	userSchema.plugin(encrypt.migrations, { 
		secret: process.env.ENCRYPTION_KEY, 
		encryptedFields: ['name', 'login', 'loginchange']
	});
	User = mongoose.model('User', userSchema);
	User.migrateToA();
	return
})
.catch((err) => {
	console.log("Connexion à MongoDB échouée");
	console.log(err);
	return
})
