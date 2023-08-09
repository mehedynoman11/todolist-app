const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");
const mongoose = require("mongoose");
const connectDB = require("./db");
require('dotenv').config();

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

connectDB();

const itemsSchema = {
  name: String
};

const Item = mongoose.model("Item", itemsSchema);

const item1 = new Item({
  name: "Welcome to TodoList"
});

const item2 = new Item({
  name: "Wake Up From Bed At 6.00 AM."
});

const item3 = new Item({
  name: "Go To Gym"
});

const defaultItems = [item1, item2, item3];

const listSchema = {
  name: String,
  items: [itemsSchema]
};

const List = mongoose.model("List", listSchema);

app.get("/", function (req, res) {
  const currentDate = date.getDate();

  Item.find({})
    .then(foundItems => {
      if (foundItems.length === 0) {
        return Item.insertMany(defaultItems);
      } else {
        return foundItems;
      }
    })
    .then((foundItems) => {
      res.render("list", { listTitle: `${currentDate}`, newListItems: foundItems });
    })
    .catch(err => {
      console.error(err);
      res.status(500).send("Internal Server Error");
    });
});

app.post("/", function(req, res) {
  const itemName = req.body.newItem;


  const newItem = new Item({
    name: itemName
  });

  newItem.save()
    .then(() => {
      res.redirect("/");
    })
    .catch(err => {
      console.error(err);
      res.status(500).send("Error saving the new item.");
    });
});

app.post("/delete", function(req, res) {
  const checkedItemId = req.body.checkbox;

  Item.findByIdAndRemove(checkedItemId)
    .then(() => {
      console.log("Successfully Deleted");
      res.redirect("/");
    })
    .catch(err => {
      console.error(err);
      res.status(500).send("Error deleting the item.");
    });
});

app.get("/:customListName", async function (req, res) {
  const customListName = req.params.customListName;

  try {
    const foundList = await List.findOne({ name: customListName }).maxTimeMS(30000);
    if (!foundList) {
      const list = new List({
        name: customListName,
        items: defaultItems
      });
      await list.save();
      res.redirect("/" + customListName);
    } else {
      res.render("list", { listTitle: foundList.name, newListItems: foundList.items });
    }
  } catch (error) {
    console.error("Error finding or creating list:", error.message);
    res.status(500).send("Error finding or creating the list.");
  }
});


app.get("/work", function (req, res) {
  res.render("list", { listTitle: "Work List", newListItems: workItems });
});

app.get("/about", function (req, res) {
  res.render("about");
});

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
