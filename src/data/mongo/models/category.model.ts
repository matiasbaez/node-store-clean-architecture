import { Schema, model } from "mongoose";

const categorySchema = new Schema({
    name: {
        type: String,
        required: [ true, "Name is required" ]
    },
    available: {
        type: Boolean,
        default: false,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
});

categorySchema.set("toJSON", {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret, options) {
        delete ret._id;
    }
});

export const CategoryModel = model("Category", categorySchema);
