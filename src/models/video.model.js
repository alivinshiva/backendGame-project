// Import mongoose and Schema for MongoDB modeling
import mongoose, {Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";



// Define the video schema for MongoDB
const videoSchema = new Schema(    
    {
        videoFile: {
            // URL or path to the video file
            type: String,
            required: true, 
        },
        thumbnail: {
            // URL or path to the thumbnail image
            type: String,
            required:true,
        },
        owner: {
            // Reference to the User who owns the video
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        title: {
            // Title of the video
            type: String,
            requied: true,
            trim: true,

        },
         description: {
            // Description of the video
            type: String,
            required: true,

         },
         duration: {
            // Duration of the video in seconds
            type: Number,
            defalult: 0
         },
         views: {
            // Number of views for the video
            type: Number,
            requied: true,
            default: 0
         },
         isPiblished: {
            // Whether the video is published or not
            type: Boolean,
            default: true
         }
    }, {timestamps: true}
)

// Add pagination plugin for aggregate queries
videoSchema.plugin(mongooseAggregatePaginate)

// Export the Video model for use in other modules
export const Video = mongoose.model("Video", videoSchema)