const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();
const {
  MongoClient,
  ServerApiVersion,
  FindCursor,
  ObjectId,
} = require("mongodb");

app.use(cors());
app.use(express.json());

const port = process.env.port || 5000;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.wtn02jv.mongodb.net/?retryWrites=true&w=majority`;
// console.log(uri);

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function mongodbConnect() {
  try {
    const postWebsiteAllPost = client.db("postWebsite").collection("allPost");

    const postWebsiteEditPost = client
      .db("postWebsite")
      .collection("allEditPost");

    const postWebsiteAllComment = client
      .db("postWebsite")
      .collection("allComment");

    app.post("/allPost", async (req, res) => {
      const body = req.body;
      //   console.log(body);
      const result = await postWebsiteAllPost.insertOne(body);
      res.send(result);
    });

    app.get("/allPost", async (req, res) => {
      const result = await postWebsiteAllPost.find({}).toArray();
      res.send(result);
    });

    app.put("/updateLoveReaction", async (req, res) => {
      const { id } = req.query;
      const data = req.body;
      // console.log(typeof data);
      const query = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updateData = {
        $set: {
          LoveCount: data.LoveCount + 1,
        },
      };
      // console.log(updateData);
      const result = postWebsiteAllPost.updateOne(query, updateData, options);
      // console.log(result);
      res.send(result);
    });
    app.put("/updateLikeReaction", async (req, res) => {
      const { id } = req.query;
      // console.log(id);
      const data = req.body;
      const query = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updateData = {
        $set: {
          LikeCount: data.LikeCount + 1,
        },
      };
      // console.log(updateData);
      const result = await postWebsiteAllPost.updateOne(
        query,
        updateData,
        options
      );
      // console.log(result);
      res.send(result);
    });

    app.post("/allUserData", async (req, res) => {
      const body = req.body;
      // console.log(body);
      const query = { email: body.email };
      const alreadyUser = await postWebsiteEditPost.findOne(query);
      if (alreadyUser) {
        return res.send({ acknowledged: true });
      }
      const result = await postWebsiteEditPost.insertOne(body);
      // console.log(result);
      res.send(result);
    });

    app.get("/EditAboutAllPost", async (req, res) => {
      const email = req.query.email;
      // console.log("1", email);

      const query = {
        email,
      };

      const result = await postWebsiteEditPost.find(query).toArray();
      // console.log(result);
      res.send(result);
    });

    app.put("/EditAbout", async (req, res) => {
      const postEditID = req.body.postEditID;
      console.log(postEditID);
      const filter = { _id: ObjectId(postEditID) };
      console.log(filter);
      const user = req.body;
      // console.log(user);
      const option = { upsert: true };
      const updatedUser = {
        $set: {
          updateEmail: user.updateEmail,
          address: user.address,
          university: user.university,
          UpdateName: user.UpdateName,
        },
      };
      const result = await postWebsiteEditPost.updateOne(
        filter,
        updatedUser,
        option
      );
      res.send(result);
      // console.log(result);
    });
    // postWebsiteAllPost.insertOne(abdul);

    app.get("/postDetails/:id", async (req, res) => {
      const { id } = req.params;
      const query = { _id: ObjectId(id) };
      const result = await postWebsiteAllPost.find(query).toArray();
      // console.log(result);
      res.send(result);
    });

    app.get("/popularPost", async (req, res) => {
      const popularPost = await postWebsiteAllPost
        .find({})
        .limit(3)
        .sort({ LoveCount: -1 })
        .toArray();
      // console.log(popularPost);
      res.send(popularPost);
    });
    app.post("/comments", async (req, res) => {
      const data = req.body;
      const dataPosted = await postWebsiteAllComment.insertOne(data);
      res.send(dataPosted);
    });
    app.get("/comments", async (req, res) => {
      const { id } = req.query;
      const query = { postId: id };
      const comment = await postWebsiteAllComment
        .find(query)
        .sort({ _id: -1 })
        .toArray();
      console.log(comment);
      res.send(comment);
    });
  } finally {
  }
}
mongodbConnect().catch((err) => console.log(err));
app.get("/", (req, res) => {
  res.send("server is running on port 500");
});

app.listen(port, () => {
  console.log("server is running");
});
