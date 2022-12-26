const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const postSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        body: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            enum: ["Active", "Inactive"],
            default: "Active"
        },
        userId: {
            type: ObjectId,
            required: true,
            ref: "User"
        },
        createdBy: {
            type: String,
        },
        geo_Location: {
            type: [String],
        },
        isDeleted: {
            type: Boolean,
            default: false
        }
    }, { timestamps: true });

module.exports = mongoose.model("Post", postSchema);
