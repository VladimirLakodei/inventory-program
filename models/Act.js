import mongoose from "mongoose";

const ActSchema = new mongoose.Schema(
    {
        number: {
            type: String,
            required: true,
            unique: true,
        },
        description: {
            type: String,
        },
        location: {
            type: String,
            required: true,
        },
        materiallyResponsible: {
            type: String,
            required: true,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        }
    },
    {
        timestamps: true
    }
);

export default mongoose.model('Act', ActSchema);
