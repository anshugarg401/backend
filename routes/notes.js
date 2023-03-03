const express = require('express');
const router = express.Router();
const { body, validationResult } = require("express-validator");
const fetchuser = require("../middleware/fetchuser");
const Notes = require("../models/Notes");
// route 1 : get all the notes from the database
router.get('/fetchallnotes',fetchuser, async (req,res)=>{
    try {
   
    const notes =  await Notes.find({user : req.user.id});
    res.json(notes)
      
} 
catch (error) {
    console.error(error.message);
    res.status(500).send("internal server error");       
}
});

// route 2 : add a new notes in the database
router.post('/addnotes',fetchuser, [
  body("title", "enter a valid tital").isLength({ min: 3 }),
  body("discription", "discription is to short ").isLength({ min: 5 }),

],
   

async (req,res)=>{
    try {
        
   
    const {title,discription,tag } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const note = new Notes({
        title,discription,tag,user: req.user.id
    });
    const notesaved = await note.save();
    res.json(notesaved);
} 
catch (error) {
    console.error(error.message);
    res.status(500).send("internal server error");        
}
});

// route 3 : update notes in the database
router.put('/updatenote/:id',fetchuser, async (req,res)=>{
    try {
   
    const {title,discription,tag} = req.body;
    const newNote = {};
    if(title){newNote.title = title};
    if(discription){newNote.discription = discription};
    if(tag){newNote.tag = tag};
    // find the note to be updated
      let note = await Notes.findById(req.params.id);
      if(!note){res.status(404).send("empty")}
      if(note.user.toString() !== req.user.id){
        res.status(401).send("not allowed")
      }
      note = await Notes.findByIdAndUpdate(req.params.id,{$set : newNote },{new:true});
      res.json({note});
} 
catch (error) {
    console.error(error.message);
    res.status(500).send("internal server error");       
}
});

// route 4 : delete notes in the database login required
router.delete('/deletenote/:id',fetchuser, async (req,res)=>{
    try {
   
//    check if the user owns the note
      let note = await Notes.findById(req.params.id);
      if(!note){res.status(404).send("empty")}
      if(note.user.toString() !== req.user.id){
        res.status(401).send("not allowed")
      }
       // find the note to be deleted and delete
      note = await Notes.findByIdAndDelete(req.params.id);
      res.json("success note has been deleted");
} 
catch (error) {
    console.error(error.message);
    res.status(500).send("internal server error");       
}
});
module.exports = router;