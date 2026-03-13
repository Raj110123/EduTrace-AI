import mongoose from "mongoose";

const GoodieSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },

        imageUrl: {
            type: String,
            required: true,
        },

        coins_required: {
            type: Number,
            required: true,
        },

        code: {
            type: String,
            required: true,
            minlength: 6,
            maxlength: 6,
            unique: true,
        },
    },
    {
        timestamps: true,
    }
);

const GoodieModel =
    mongoose.models.Goodie || mongoose.model("Goodie", GoodieSchema);

export default GoodieModel;