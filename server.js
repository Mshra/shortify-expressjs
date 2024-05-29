import express from 'express';
import dotenv from 'dotenv';
import Url from './models/Url.js'
import generateRandomCode from './models/generate_id.js';
import mongoose from 'mongoose';
import cors from 'cors';

dotenv.config()

const app = express();
app.use(cors())
app.use(express.json())

mongoose.connect(process.env.DB_URI)
  .then(console.log('mongodb connected'))
  .catch(error => console.error(error));

app.get('/', (req, res) => res.send('hello'));

app.post('/shorten', async (req, res) => {
  let originalUrl = req.body.originalUrl.url;
  const baseURL = process.env.URL;

  try {
    let url = await Url.findOne({ originalUrl })
    const shortId = generateRandomCode(5)

    if (url) {
      console.log(url)
      return res.json(url)
    } else {
      const shortUrl = baseURL + shortId;

      url = new Url({
        originalUrl,
        shortUrl,
        urlCode: shortId,
        date: new Date()
      })

      await url.save()
      return res.json(url)
    }
  } catch (err) {
    console.error(err)
    return res.status(401).json('Server error')
  }
})

app.get('/:code', async (req, res) => {
  const shortUrl = process.env.URL + req.params.code
  try {
    const url = await Url.findOne({ shortUrl: shortUrl });

    if (url) {
      return res.redirect(url.originalUrl);
    } else {
      return res.status(404).json('No URL found');
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json('Server error');
  }
});

app.delete('/:code/delete', async (req, res) => {
  const shortUrl = process.env.URL + req.params.code
  try {
    const url = await Url.findOneAndDelete({ shortUrl: shortUrl });

    if (url) {
      return res.json('URL deleted');
    } else {
      return res.status(404).json('No URL found');
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json('Server error');
  }
});

app.listen(3000, () => console.log(`Server ready on PORT: 3000`));
export default app;
