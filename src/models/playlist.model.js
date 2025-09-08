import mongoose, { Schema } from "mongoose";


const playlistSchema = new Schema(
    {
        name: {
            type: String,
            requird: true,
            default: "Unmaned Playlist"
        },
        description: {
            type: String,
            default: "No description"
        },
        videos: {
            type: Schema.Types.ObjectId,
            ref: "Video",
            required: true
        },
        owner: {
            type: Schema.Types.ObjectId,
            ref: "User",
        }
    },
    {timestamps: true}
)

export const Playlist = mongoose.model("Playlist", playlistSchema)
