import mongoose from "mongoose";

// 이렇게 모델을 만들면 mongoose가 CRUD하는 것을 도와줌
const videoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  fileUrl : { type : String, required : true },
  thumbUrl: { type: String, required: true },
  description: { type: String, required: true },
  createdAT: { type: Date, required: true, default: Date.now },
  hashtags: [{type:String, trim: true}],
  meta: {
    views: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },
  },
  comments: [{type: mongoose.Schema.Types.ObjectId, required: true, ref: "Comment"}],
  owner : { type : mongoose.Schema.Types.ObjectId, required : true, ref : "User"},
})

videoSchema.static("formatHashtags", function (hashtags) {
  return hashtags.split(",").map((word) => (word.startsWith("#") ? word : `#${word}`))
})

const Video = mongoose.model("Video", videoSchema)

export default Video