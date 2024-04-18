const getTagsFromSocialProfileData = (profileData: any) => {
  // first try to get tags from plCategories, then category (deprecated/old format), then default to empty array

  if (!profileData) return [];
  const DEPRECATED_CATEGORY_MAPPINGS: Record<string, string> = {
    "social-impact": "Social Impact",
    "non-profit": "NonProfit",
    climate: "Climate",
    "public-good": "Public Good",
    "de-sci": "DeSci",
    "open-source": "Open Source",
    community: "Community",
    education: "Education",
  };
  const tags = profileData.plCategories
    ? JSON.parse(profileData.plCategories)
    : profileData.category
    ? [profileData.category.text ?? DEPRECATED_CATEGORY_MAPPINGS[profileData.category] ?? ""]
    : [];
  return tags;
};

export default getTagsFromSocialProfileData;
