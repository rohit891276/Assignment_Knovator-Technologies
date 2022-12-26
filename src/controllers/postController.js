const PostModel = require('../models/postModel.js');

const { isValid, isValidRequest, nameRegex, alphaNumericValid } = require('../validator/validations.js')

// C - Create
const createPost = async function (req, res) {
    try {
        const postData = req.body;
        const userId = req.params.userId;
        
        // validation for empty body
        if (!isValidRequest(postData))
            return res.status(400).send({ status: false, message: "Post data is required" });

        // Destructuring
        const { title, body, status, createdBy, geo_Location } = postData;


        if (await PostModel.findOne({ title: title })) {
            return res.status(400).send({ status: false, message: "Post is already exists" });
        }
        //validation for title
        if (!isValid(title))
            return res.status(400).send({ status: false, message: "Title is required" });
        if (!alphaNumericValid(title))
            return res.status(400).send({ status: false, message: "Please provide valid title-name of the post" });

        //validation for body
        if (!isValid(body))
            return res.status(400).send({ status: false, message: "Body is required" });

        //validation for status
        if (status) {
            if (status != "Active" && status != "Inactive")
                return res.status(400).send({ status: false, message: "enter status [Active, Inactive]" });
        }

        //validation for createdBy
        if (!isValid(createdBy))
            return res.status(400).send({ status: false, message: "CreatedBy is required" });
        if (!nameRegex(createdBy))
            return res.status(400).send({ status: false, message: "Please provide valid createdBy" });


        //validation for geo_Location
        if (!isValid(geo_Location))
            return res.status(400).send({ status: false, message: "geo_Location is required" });

        const createdPost = await PostModel.create(postData);
        res.status(201).send({ status: true, message: createdPost });

    } catch (error) {
        res.status(500).send({ status: false, message: error.message });
    }
};

// R -Read

const getAllPosts = async function (req, res) {
    try {
        let getPost = await PostModel.find({ isDeleted: false });
        res.status(200).send({ status: true, message: getPost });

    } catch (error) {
        res.status(500).send({ status: false, message: error.message });
    }
};


// U - Update
const updatepost = async function (req, res) {
    try {
        const id = req.params.postId;
        const data = req.body;
        const { title, body, status, createdBy, geo_Location } = data;
        if (!isValidRequest(data))
            return res.status(400).send({ status: false, message: "Body cannot remain empty" });

        const post = await PostModel.findOne({ _id: id, isDeleted: false });
        if (!post)
            return res.status(404).send("No such blog found");

        if (title) post.title = title;
        if (body) post.body = body;
        if (status) post.status = status;
        if (createdBy) post.createdBy = createdBy;
        if (geo_Location) {
            post.geo_Location.push(geo_Location);
        }

        const updateData = await PostModel.findByIdAndUpdate({ _id: id }, post, { new: true });
        res.status(200).send({ status: true, message: updateData });

    } catch (error) {
        res.status(500).send({ status: false, message: error.message });
    }
};


const deletePost = async function (req, res) {
    try {
        let id = req.params.postId;
        const findPost = await PostModel.findOne({ _id: id, isDeleted: false });
        if (!findPost) {
            return res.status(404).send({ status: false, message: "This blog is not found or deleted." });
        }
        findPost.isDeleted = true;
        const deletedPost = await PostModel.findByIdAndUpdate({ _id: id }, findPost, { new: true });
        res.status(200).send({ status: true, message: "Successfully Deleted" });

    } catch (error) {
        res.status(500).send({ status: false, message: error.message });
    }
};

// count the active/inactive post

const findActiveOrInactive = async function (req, res) {
    try {
        const findActivePost = await PostModel.find({ status: "Active", isDeleted: false }).count()
        if (findActivePost.length === 0)
            return res.status(404).send({ status: false, message: "No Active post found" });

        const findInactivePost = await PostModel.find({ status: "Inactive", isDeleted: false }).count()
        if (findActivePost.length === 0)
            return res.status(404).send({ status: false, message: "No Inactive post found" });

        return res.status(200).send({ status: true, message: `Total Active post is ${findActivePost} and Total Inactive post is ${findInactivePost}` })

    } catch (error) {
        res.status(500).send({ status: false, message: error.message });
    }


}


module.exports = { createPost, getAllPosts, updatepost, deletePost, findActiveOrInactive }