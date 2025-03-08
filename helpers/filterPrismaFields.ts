export const filterPrismaFields = (data: Record<string, any>, excludedFields: string[]) => {
  return Object.fromEntries(
    Object.entries(data).filter(([key, value]) => 
      !excludedFields.includes(key) && value !== "" && value !== undefined
    )
  );
};
