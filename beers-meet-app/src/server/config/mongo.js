
const mongoose = require('mongoose');
const meetupModel = require('../models/meetup');
const userModel = require('../models/users');
const users = require('./data/users.json');
const meetups = require('./data/meetups.json');
const USERS_COLLECTION = 'users';
const MEETUPS_COLLECTION = 'meetups'
const collections = [
  MEETUPS_COLLECTION,
  USERS_COLLECTION
];

const populateDB = (collection) => {
  switch (collection) {
    case USERS_COLLECTION:
      userModel.create(users, (err, data) => {
        if (err) {
          console.log(`error to populate ${collection}`)
        } else {
          console.log(`${collection} has been populated successly`);
        }
      })
      break;
    case MEETUPS_COLLECTION:
      meetupModel.create(meetups, (err, data) => {
          if (err) {
            console.log(`error to populate ${collection}`)
          } else {
            console.log(`${collection} has been populated successly`);
          }
        })
        break;
  }
}

try {
  const connect = () => {
    if (mongoose.connection.readyState === 0) {
      mongoose.connect(`mongodb://localhost:27017/beerMeetup`, {
        useFindAndModify: false,
        useUnifiedTopology: true,
        useNewUrlParser: true
      });
    }
  }

  mongoose.connection.on('connecting', () => {
    console.log('Connecting to mongo...')
  })

  mongoose.connection.on('open', () => {
    console.log('Connected to mongo');
    collections.forEach((collection) => {
      mongoose.connection.db.listCollections({name: collection})
        .next(function(err, collinfo) {
          if (!collinfo) {
            mongoose.connection.db.createCollection(collection, (err, data) => {
              if (err) {
                console.log(`error trying create ${collection} collection`)
              } else {
                console.log(`Collection ${collection} created successly`)
                populateDB(collection)
              }
            })
          }
      });


    })


  })

  mongoose.connection.on('error', () => {
    console.error('MongoDB Error');
  })

  mongoose.connection.on('reconnected', () => {
    console.error('MongoDB reconnected...');
  })

  mongoose.connection.on('disconnected', () => {
    console.log('mongoDb disconnected');
    setTimeout(() => {
      connect()
    }, 10000)
  });

  connect();
  // If the node procces ends. close the mongoose connection
  process.on('SIGINT', () => {
    mongoose.connection.close(() => {
      console.log('Mongoose default connection disconnected through app termination');
      process.exit(0);
    })
  })

}catch (error) {
  console.error(error);
}
