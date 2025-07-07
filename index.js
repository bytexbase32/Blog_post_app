import express from "express"

const app = express();
const port = 4000;

let nextId = 1;
let posts = [];

app.use(express.urlencoded({extended:true}));

app.use(express.static("public"));

app.get("/", (req, res) =>{
    res.render("index.ejs", {posts});
});

app.post("/", (req, res) => {
  const { title, content } = req.body;

  // Simple validation to prevent empty posts
  if (!title || !content) {
    // Could show an error message here instead of redirecting silently
    return res.status(400).send("Title and content are required.");
  }

  const post = {
    id: nextId++,
    title: title.trim(),
    content: content.trim(),
  };
  posts.push(post);

  res.redirect("/");
});


app.get("/edit/:id", (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id))
        return res.status(400).send("Invalid post ID");
    const post = posts.find(p => p.id === id);
    if (!post)
    {
        return res.status(404).send("Post not found");
    }
    //show full blog post with this id.
    res.render("edit.ejs",{post});
});

app.post("/edit/:id", (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id))
        return res.status(400).send("Invalid post ID");
    const postIndex = posts.findIndex(p => p.id === id);

    if (postIndex == -1)
        return res.status(404).send("Post not found");
    if (!req.body.title || !req.body.content)
        return res.status(400).send("Title and content are required!");
    posts[postIndex]=
    {
        id: id,
        title:req.body.title.trim(),
        content:req.body.content.trim()
    };
    res.redirect("/");
});



app.post("/delete/:id", (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id))
        return res.status(400).send("Invalid post ID");
    const postIndex = posts.findIndex(p => p.id === id);
    if (postIndex == -1)
        return res.status(404).send("Post not found.");
    posts.splice(postIndex, 1);
    res.redirect("/");
});


app.get("/post/:id", (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id))
        return res.status(400).send("Invalid post ID");
    const post = posts.find(p => p.id === id);
    if (!post)
        return res.status(404).send("Post not found");
    res.render("post.ejs", {post});
    //show full blog post with this id.
});



app.listen(port, ()=>{
    console.log(`Server running on port ${port}.`);
});

