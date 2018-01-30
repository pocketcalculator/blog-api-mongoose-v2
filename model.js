const mongoose = require('mongoose');

// this is our schema to represent a blogpost
const blogPostSchema = mongoose.Schema({
  title: {
    type: String, required: true
  },
  content: {
    type: String, required: true
  },
  created: {
    type: Date, default: Date.now()
  },
  author: {
    firstName: String,
    lastName: String
  }
})

blogPostSchema.virtual('authorName').get(function(){
  return `${firstName} ${lastName}`
})

blogPostSchema.methods.serialize = function(){
  return {
    title, content, created, author:this.authorName
  }
}

const BlogPost = mongoose.model('BlogPost', blogPostSchema)

module.exports = {BlogPost}
