export const JOB_LINKS = {
  blueCollar: "https://www.indeed.com/jobs?q=%E9%85%8D%E7%AE%A1%E5%B7%A5%E3%83%BB%E5%BB%BA%E8%A8%AD",
  tech: "https://www.indeed.com/jobs?q=%E3%82%A8%E3%83%B3%E3%82%B8%E3%83%8B%E3%82%A2",
  general: "https://www.indeed.com/jobs?q=%E5%96%B6%E6%A5%AD",
  highIncome: "https://www.indeed.com/jobs?q=%E5%B9%B4%E5%8F%8E500%E4%B8%87%E4%BB%A5%E4%B8%8A",
};

export function getJobUrl(resultId: string): string {
  if (resultId === "high_potential" || resultId === "mid_senior") return JOB_LINKS.general;
  return JOB_LINKS.general;
}
