const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  username: {
    type: String,
    required: true,
    unique: true
  },
  local: {
    email: { 
      type: String,
    },
    password: { type: String },
  },
  google: {
    id: { type: String },
    email: { 
      type: String,
    },
  },
  facebook: { 
    id: { type: String },
    email: { 
      type: String,
    },
  },
  topics: [{ type: String }],
  isActive: { type: Boolean, default: true },
  created: { type: Date, default: new Date() }
});

UserSchema.pre('save', function(next) {
  try {
    if(this.strategy === 'local') {
      bcrypt.hash(this.local.password, 10, (err, hash) => {
        if(err)                
          return next(err);

        this.local.password = hash;
        next();
      });
    };
    if(this.strategy === 'google')
      next();

    if(this.strategy === 'facebook')
      next();

  } catch (err) {
    next(err);
  };
});

module.exports = mongoose.model('User', UserSchema);