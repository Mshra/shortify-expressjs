import mongoose from 'mongoose';
import shortid from 'shortid';

const UrlSchema = new mongoose.Schema({
  urlCode: {
    type: String,
    required: true,
    unique: true,
    defautlt: shortid.generate
  },
  originalUrl: {
    type: String,
    required: true
  },
  shortUrl: {
    type: String,
    required: true
  },
  date: {
    type: String,
    default: Date.now
  }
});

export default mongoose.model('Url', UrlSchema);
