"use strict";


const DBService = require("./DBService"),
    ReportingService = require("./reportingservice")

module.exports = class Reporting {
    static getAverageReviewScorePerCustomer(start_date, end_date) {
        const avg_score = ReportingService.fetchAverageReviewScorePerCustomer(start_date, end_date).score;
        return avg_score;
    }
};

/**
 *
 * Review_Sources
 * id
 * type
 *
 *
 *
 *  Reviews
 *  id
 *  customer_id
 *  star_rating
 *  text
 *  review_score
 *  review_source_id
 *  created_at
 *
 *
 */