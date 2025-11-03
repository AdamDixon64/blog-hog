import express from "express";
import { BlogPost } from "./modules/blogPost.js";
import { postDatabase } from "./modules/database.js"

const __dirname = import.meta.dirname;
const app = express();
const port = 3000;

app.use(express.static(__dirname + "/public"));
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  const sortedPosts = postDatabase.toSorted((a, b) => {
    return b.views - a.views;
  }).toSpliced(5);

  res.render(__dirname + "/views/index.ejs",
    {
      view: "home.ejs",
      topPosts: sortedPosts,
      posts: postDatabase.toReversed(),
    }
  );
});

app.get("/new-post", (req, res) => {
  res.render(__dirname + "/views/index.ejs", 
    {
      view: "forms/createPost.ejs",
    }
  );
});

app.get("/post/:postId", (req, res) => {
  const post = postDatabase.find(post => {
    return post.id === req.params.postId;
  });

  post.postViewed();

  res.render(__dirname + "/views/index.ejs", 
    {
      view: "viewPost.ejs",
      post: post,
    }
  );
});

app.get("/delete/:postId", (req, res) => {
  const index = postDatabase.findIndex(post => {
    return post.id === req.params.postId;
  });

  if (index > -1) {
    postDatabase.splice(index, 1);
  }

  res.redirect("/");
});

app.get("/edit/:postId", (req, res) => {
  const post = postDatabase.find(post => {
    return post.id === req.params.postId;
  });

  res.render(__dirname + "/views/index.ejs", 
    {
      view: "forms/editPost.ejs",
      post: post,
    }
  );
});

app.post("/create-post", (req, res) => {
  postDatabase.push(
    new BlogPost(
      req.body["postTitle"],
      req.body["postBody"],
    )
  );

  res.redirect("/");
});

app.post("/edit-post/:postId", (req, res) => {
  const index = postDatabase.findIndex(post => {
    return post.id === req.params.postId;
  });

  postDatabase[index].title = req.body["postTitle"];
  postDatabase[index].postBody = req.body["postBody"];
  postDatabase[index].lastEdited = new Date();
  
  res.redirect(`/post/${req.params.postId}`);
});

app.listen(port, () => {
  populateDummyData();

  console.log(`Listening on port ${port}`);
});

function populateDummyData() {
  postDatabase.push(
    new BlogPost(
      "Lorem ipsum dolor sit amet consectetur",
      "Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos.",
    )
  );

  postDatabase.push(
    new BlogPost(
      "Ad litora torquent per conubia nostra inceptos himenaeos",
      "Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos.",
    )
  );

  postDatabase.push(
    new BlogPost(
      "Litora torquent per conubia nostra inceptos",
      "Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos.",
    )
  );

  postDatabase.push(
    new BlogPost(
      "Un Conubia nostra inceptos himenaeos",
      "Leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos.",
    )
  );

  postDatabase.push(
    new BlogPost(
      "Tempor Conubia nostra inceptos himenaeos",
      "Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos.",
    )
  );

  postDatabase.push(
    new BlogPost(
      "On Conubia nostra inceptos himenaeos",
      "Aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos.",
    )
  );

  postDatabase.push(
    new BlogPost(
      "Nostra inceptos himenaeos",
      "Tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos.",
    )
  );

  postDatabase.forEach((post) => {
    post.views = Math.floor(Math.random() * Math.floor(Math.random() * 9999999));
  });
}