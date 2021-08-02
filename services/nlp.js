"use strict";


const NLPBackendService = require("./nlpbackendservice"),
    DBService = require("./DBService")

module.exports = class Nlp {
    static shouldTriggerReviewBox(text) {
        const NLPBackendServiceResponse = NLPBackendService.getReviewResponse(text);
        const isReview = NLPBackendServiceResponse.isReview;
        const shouldRequestReview = NLPBackendServiceResponse.shouldRequestReview;
        if (isReview) {
            const reviewScore = NLPBackendServiceResponse.reviewScore;
            DBService.storeReview(text, reviewScore);
            return false;
        }
        else if (shouldRequestReview) {
            return true;
        }
        else {
            return false;
        }

    }
};