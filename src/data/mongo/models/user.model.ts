import { Schema, model } from "mongoose";

const userSchema = new  Schema({
    name: {
        type: String,
        required: [ true, "Name is required" ]
    },
    email: {
        type: String,
        required: [ true, "Email is required" ],
        unique: true,
    },
    password: {
        type: String,
        required: [ true, "Password is required" ],
    },
    emailValidated: {
        type: Boolean,
        default: false,
    },
    image: {
        type: String
    },
    role: {
        type: [String],
        emun: ["ADMIN", "USER"],
        default: ["USER"]
    }
});

userSchema.set("toJSON", {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret, options) {
        delete ret._id;
        delete ret.password;
    }
});

export const UserModel =    model("User", userSchema);
