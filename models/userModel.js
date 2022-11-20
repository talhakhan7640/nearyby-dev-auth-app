import mongoose from "mongoose";

const userSchema = mongoose.Schema ({
    email: {
        type: String,
        required: [true, "Please provide an email!"],
        unique: [true, "Email exist!"]
    },
    password: {
        type: String,
        required: [true, "Please provide a password!"],
        unique: false
    },
})

const User = mongoose.model('user', userSchema)

export default User;