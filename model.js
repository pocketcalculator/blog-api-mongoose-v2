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
  return `${this.author.firstName} ${this.author.lastName}`
})

blogPostSchema.methods.serialize = function(){
  return {
    id: this._id,
    title: this.title,
    content: this.content,
    created: this.created,
    author: this.authorName
  }
}

const BlogPost = mongoose.model('BlogPost', blogPostSchema)

module.exports = {BlogPost}
