const mongoose = require('mongoose');

const testCaseSchema = new mongoose.Schema({
    problemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Problem', required: true },
    input: { type: String, required: true },
    expected_output: { type: String, required: true },
    index: { type: Number, required: true },
    points: { type: Number, default: 1 },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    editedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, {
    timestamps: true
});

module.exports = mongoose.model('TestCase', testCaseSchema); 