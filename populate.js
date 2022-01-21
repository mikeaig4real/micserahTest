require('dotenv').config();
const { readFile } = require('fs/promises')

const connectDB = require('./db/connect');
const User = require('./models/User');
const Follower = require('./models/Follower');

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI)
    await User.deleteMany()
    await Follower.deleteMany()
    const jsonFollowers = JSON.parse(
      await readFile('./Followers.json', 'utf-8')
    )
    const filterF = jsonFollowers.map((follower) => {
      let obj = {};
      for (let key in follower) {
        if (key !== '_id') {
          if (key == 'createdAt') {
            obj[key] = follower[key].$date
          } else {
            obj[key] = follower[key]
          }
        } else {
          obj[key] = follower[key].$oid
        }
      }
      return obj;
    });
    // console.log(filterF[0])
    await Follower.create(filterF)
    const jsonUsers = JSON.parse(
      await readFile('./Users.json', 'utf-8')
    )
    const filterU = jsonUsers.map((user) => {
      let obj = {};
      for (let key in user) {
        if (key !== '_id') {
          if (key == 'dob' || key == 'registerDate') {
            obj[key] = user[key].$date
          } else {
            obj[key] = user[key]
          }
        } else {
          obj[key] = user[key].$oid
        }
      }
      return obj;
    });
    // console.log(filterU[0])
    await User.create(filterU)
    console.log('Success!!!')
    process.exit(0)
  } catch (error) {
    console.log(error)
    process.exit(1)
  }
}

start();


