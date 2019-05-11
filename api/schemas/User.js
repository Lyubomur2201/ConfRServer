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
  isActive: { type: Boolean, default: false },
  verificationCode: { type: String },
  resetCode: { type: String },
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

UserSchema.pre('update', async function(next) {
  try {
    if(this.getUpdate().$set.strategy == 'password-reset') {
      const hash = await bcrypt.hash(this.getUpdate().$set.password, 10);
      this.getUpdate().$set.strategy = undefined;
      
      await this.update({$set: {'local.password': hash, resetCode: undefined}});
      
      next();
    } else {
      next();
    };
  } catch (error) {
    next(error);
  };
});

module.exports = mongoose.model('User', UserSchema);