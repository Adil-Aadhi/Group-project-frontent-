import { useState } from "react";
import { competitorService } from "../../services/competitor/competitorService";

export const useCompetitorAnalysis = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const analyzeCompetitor = async (competitor) => {
    try {
      setIsAnalyzing(true);

      const response = await competitorService.startAnalysis(competitor);

      console.log("Analysis started:", response);

      return response;

    } catch (err) {
      console.error("Failed to start analysis", err);
      throw err;

    } finally {
      setIsAnalyzing(false);
    }
  };

  return {
    analyzeCompetitor,
    isAnalyzing,
  };
};