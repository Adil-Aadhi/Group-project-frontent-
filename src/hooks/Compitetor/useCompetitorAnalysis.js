import { useState } from "react";
import { competitorService } from "../../services/competitor/competitorService";
import { useProgressStore} from "../../store/progressStore"
import { useAuthStore } from "../../store/authStore";

export const useCompetitorAnalysis = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const { startJob } = useProgressStore();
  const { slug } = useAuthStore();

  const analyzeCompetitor = async (competitor) => {
    try {
      setIsAnalyzing(true);

      const response = await competitorService.startAnalysis(competitor);

      console.log("Analysis started:", response);

      startJob({
        companyId: `company_${slug}`,
        companyName: response.company_name,
        type: "competitor",
      });

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