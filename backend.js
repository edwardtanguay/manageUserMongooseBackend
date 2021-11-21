import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

const app = express();
const port = 3016;
const mongoConnectString = 'mongodb://localhost:27017/api001';
mongoose.connect(mongoConnectString);

const userSchema = mongoose.Schema({
	name: String,
	username: String,
	email: String
});
const UserModel = mongoose.model("user", userSchema, "users100");

app.use(cors());
app.use(express.json());

app.get('/', async (req, res) => {
	const users = await UserModel.find({}).select('name username email');
	res.json(users);
});

app.delete('/deleteuser/:id', async (req, res) => {
	const id = req.params.id;
	const deleteResult = await UserModel.deleteOne({ _id: new mongoose.Types.ObjectId(id) });
	res.json({
		result: deleteResult
	})
});

app.post('/insertuser', (req, res) => {
	const user = req.body.user;
	const user1 = new UserModel(user);
	user1.save(err => {
		if (err) {
			res.status(500).send({ err })
		} else {
			res.json({
				userAdded: user1
			});
		}
	});
});

app.patch('/edituseremail/:id', async (req, res) => {
	const id = req.params.id;
	const email = req.body.email;
	const updateResult = await UserModel.findOneAndUpdate({ _id: new mongoose.Types.ObjectId(id) }, { $set: { email } }, { new: true });
	res.json({
		result: updateResult
	});
});

app.listen(port, () => {
	console.log(`listening on http://localhost:${port}`);
});