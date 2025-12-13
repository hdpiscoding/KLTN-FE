export interface PredictionData {
    prediction_id: string;
    predicted_price: number;
    predicted_price_billions: number;
    livability_score: number;
    component_scores: {
        score_healthcare: number;
        score_education: number;
        score_transportation: number;
        score_environment: number;
        score_public_safety: number;
        score_shopping: number;
        score_entertainment: number;
    };
    ai_insight: string;
}