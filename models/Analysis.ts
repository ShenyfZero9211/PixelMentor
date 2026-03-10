import mongoose from 'mongoose';

const AnalysisSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false,
    },
    isGuest: {
        type: Boolean,
        default: false,
    },
    ipAddress: {
        type: String,
        required: false,
    },
    imageUrl: {
        type: String,
        required: true,
    },
    prompt: {
        type: String,
        required: true,
    },
    result: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.models.Analysis || mongoose.model('Analysis', AnalysisSchema);
